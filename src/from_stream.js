import {pump} from './pump'

export function fromStream(eventSource, dataEvent = 'data', closeEvent = 'close') {
  return pump(async (target, hasStopped) => {
    await target.next()

    async function listener(...args) {
      if (eventSource.pause)
        eventSource.pause()
      await target.next(...args)
      if (eventSource.resume)
        eventSource.resume()
    }

    async function closeListener() {
      target.return()
    }

    eventSource.on(dataEvent, listener)
    eventSource.on(closeEvent, closeListener)
    hasStopped.then(() => {
      eventSource.removeListener(dataEvent, listener)
      eventSource.removeListener(closeEvent, closeListener)
    })
  })
}
