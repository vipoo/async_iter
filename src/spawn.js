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
export async function spawn(...args) {

  const stackTrace = {}
  Error.captureStackTrace(stackTrace)

  return await pump(async (target, hasStopped) => {
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
