import {pump} from './pump'

/**
 * Returns an iterator, that emits as per the <code>dataEvent</code> of the <code>eventSource</code>
 * @param  {EventEmitter} eventSource   An object that supports the <code>on</code> and <code>removeListener</code> function
 * @param  {String} [dataEvent=data]    The main dataEvent name to listen to
 * @param  {String} [closeEvent=close]  When this event emits, the iteration is stopped
 * @return {iteration}                  An iterable source
 * @memberOf module:GeneratorFunctions
 * @name fromStream
 * @function
 */
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
