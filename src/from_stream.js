import {pump} from './pump'

export function fromStream(eventSource) {
  return pump(async (target, hasStopped) => {
    await target.next()

    async function listener(...args) {
      eventSource.pause()
      await target.next(...args)
      eventSource.resume()
    }

    eventSource.on('data', listener)
    hasStopped.then(() => eventSource.removeListener('data', listener))
  })
}
