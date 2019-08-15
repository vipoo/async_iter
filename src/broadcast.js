import {pump} from './pump'
import {promiseSignal} from './lib/promise_helpers'

/**
```
import {broadcast} from 'async_iter/pipeline/broadcast' # pipeline version
import {broadcast} from 'async_iter/broadcast' # conventional version
```
Returns a generator function that will subscribe to the source iteration
<br/>
Each generator function, will iterate over the same source values
<br/>
> * No queing of values, so each consumer will be made to wait for all other consumers
<br/>
> * The source iteration is not started, until at least one subscription has started consuming
<br/>
> * The source iteration is paused, if all consumers are stopped.  Any new subscriptions will continue from where the source iteraion was iterated to

 * @param  {Iterable}         source        The source iteration to broadcast to all subscribers
 * @return {Function} a generator function to create an iterable of the source items
 <br/>
.return - A function to close all consumer iterators and close the source iteration.
 */
export function broadcast(source) {
  let count = 1
  const subscribers = {}
  const pumps = {}
  let firstSubscription = promiseSignal()
  let sourceHasStopped = false
  let lastEmittedValue = undefined
  let broadcastHasStopped = false

  function removeAllSubscribers() {
    for (const key of Object.keys(subscribers)) {
      subscribers[key].return()
      pumps[key].return()
      delete subscribers[key]
      delete pumps[key]
    }
  }

  function pushToAllSubscribers(x) {
    const pending = Object
      .entries(subscribers)
      .map(([key, value]) => value.next(x)
        .then(r => ({...r, key})))

    return Promise.all(pending)
  }

  function throwErrorToAllSubscribers(err) {
    const pending = Object
      .values(subscribers)
      .map(value => value.throw(err))

    return Promise.all(pending)
  }

  /* eslint complexity: ['error', 5] */
  process.nextTick(async () => {
    await firstSubscription.promise
    try {
      for await (const x of source) {
        lastEmittedValue = x
        await pushToAllSubscribers(x)

        if (broadcastHasStopped)
          break

        if (Object.entries(subscribers).length === 0) {
          firstSubscription = promiseSignal()
          await firstSubscription.promise
        }
      }
    } catch (err) {
      await throwErrorToAllSubscribers(err)

    } finally {
      sourceHasStopped = true
      removeAllSubscribers()
    }
  })

  const result = (inclusiveOfPreviousValue = false) => {
    if (sourceHasStopped)
      throw new Error('Source iteration has already completed')

    const key = count++
    pumps[key] = pump(async (target, hasStopped) => {
      hasStopped.then(() => {
        delete subscribers[key]
        delete pumps[key]
      }).catch(() => {
        delete subscribers[key]
        delete pumps[key]
      })
      if (sourceHasStopped)
        throw new Error('Source iteration has already completed')
      await target.next()
      subscribers[key] = target
      firstSubscription.res()
      if (inclusiveOfPreviousValue && lastEmittedValue)
        await target.next(lastEmittedValue)
    })

    return pumps[key]
  }

  result.return = async () => {
    if (broadcastHasStopped)
      return
    removeAllSubscribers()
    broadcastHasStopped = true
  }

  return result
}
