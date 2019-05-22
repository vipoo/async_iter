import {promiseSignal} from './lib/promise_helpers'
import {asAsyncIterator} from './lib/get_iterator'

/* eslint complexity: ['error', 4] */
export async function* rateLimit(source, maxAmount, perPeriod, counter = () => 1) {
  source = await asAsyncIterator(source)

  let forBucketAboveZero = promiseSignal()
  forBucketAboveZero.res()

  let bucket = maxAmount
  const inc = (100 / perPeriod) * maxAmount
  const interval = setInterval(() => {
    bucket = Math.min(maxAmount, bucket + inc)
    if (bucket >= 0)
      forBucketAboveZero.res()

  }, 100)

  try {
    while (true) {
      const item = await source.next()
      if (item.done)
        return
      bucket = bucket - counter(item.value)
      if (bucket < 0) {
        forBucketAboveZero = promiseSignal()
        await forBucketAboveZero.promise
      }
      yield item.value
    }
  }
  finally {
    clearInterval(interval)
  }
}
