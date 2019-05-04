import {pump} from './latch'
import {deferredPromise} from './promise_helpers'

export function broadcast(source) {
  let count = 1
  const subscribers = {}
  const pumps = {}
  let firstSubscription = deferredPromise()
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
          firstSubscription = deferredPromise()
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
      }).catch(err => {
        delete subscribers[key]
        delete pumps[key]
      })
      if (sourceHasStopped)
        throw new Error('Source iteration has already completed')
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
