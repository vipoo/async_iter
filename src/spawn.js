import {pump} from './pump'
import childProcess from 'child_process'

class SpawnError extends Error {
  constructor(errorCode, stack) {
    super(`Process exited with code ${errorCode}`)
    this.name = this.constructor.name
    this.message = `Process exited with code ${errorCode}`
    this.stack = stack
  }
}

/**
 * Adapter for the nodejs function `child_process.spawn`.  Mapping the stdout and stderr to an iterable
 *
 * @param {string}    command The command to run
 * @param {string[]=} args The arguments to supply to the command
 * @param {object=}   options Any options to be passed thru to child_process.spawn
 * @return {iteration} An iterable source that contain an object with one of 2 keys (stdout or stderr)
 * @function
 * @memberof module:Generators
 * @name spawn
 */
export function spawn(...args) {

  const stackTrace = {}
  Error.captureStackTrace(stackTrace)

  return pump(async (target, hasStopped) => {
    await target.next()
    const p = childProcess.spawn(...args)
    p.stdout.on('data', stdout => {
      target.next({stdout}).then(() => p.kill('SIGCONT'))
      p.kill('SIGSTOP')
    })
    p.stderr.on('data', stderr => {
      target.next({stderr}).then(() => p.kill('SIGCONT'))
      p.kill('SIGSTOP')
    })
    p.on('close', err => err ? target.throw(new SpawnError(err, stackTrace.stack)) : target.return())

    hasStopped.then(() => p.kill())
  })
}
