import {pump} from './pump'

/**
```
import {interval} from 'async_iter/interval'
```
Returns an async iterator the will emit every `period` milliseconds

> * The iterator will block its emitted values, until the consumer has consumed the item,
therefore there is no racing of producer to consumer.

> * The iteration stops, when the consumer breaks, stop the iteration or the cancel promise is resolved

 * @param  {Number}   period the time in milliseconds the iterator emits
 * @param  {Promise} cancel A promise that when it resolves, causes the interval to stop generating values
 * @return {Iterable} An iteration that emits as per the interval period
 * @function
 */
export function interval(period, cancel = new Promise(() => {})) {
  return pump(async target => {
    const result = await Promise.race([target.next(), cancel.then(() => ({done: true}))])
    if (result.done)
      return target.return()

    return new Promise(res => {
      cancel.then(() => {
        currentPromise = null
        clearInterval(intervalHandle)
        target.return()
        res()
      })
      let intervalHandle = undefined
      let currentPromise = undefined
      const intervalFunction = async () => {
        if (currentPromise)
          return

        const v = process.hrtime.bigint()
        currentPromise = await Promise.race([target.next(v), cancel.then(() => ({done: true}))])
        if (currentPromise.done) {
          currentPromise = null
          clearInterval(intervalHandle)
          await target.return()
          res()
        }
        currentPromise = null
      }

      intervalHandle = setInterval(intervalFunction, period)
    })
  })
}
