import {getIterator} from './lib/get_iterator'
import {deferredPromise} from './promise_helpers'

/* eslint complexity: ['error', 4] */
export async function* rateLimit(source, maxAmount, perPeriod, counter = () => 1) {
  let forBucketAboveZero = deferredPromise()
  forBucketAboveZero.res()

  let bucket = maxAmount
  const intervalPeriod = (perPeriod / maxAmount)
  const interval = setInterval(() => {
    bucket = Math.min(maxAmount, bucket + 1)
    if (bucket >= 0)
      forBucketAboveZero.res()

  }, intervalPeriod)

  const sourceItems = getIterator(source)

  try {
    while (true) {
      const item = await sourceItems.next()
      if (item.done)
        return
      bucket = bucket - counter(item.value)
      if (bucket < 0) {
        forBucketAboveZero = deferredPromise()
        await forBucketAboveZero.promise
      }
      yield item.value
    }
  }
  finally {
    clearInterval(interval)
  }
}
