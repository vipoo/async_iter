import {promiseSignal} from './lib/promise_helpers'
import {asAsyncIterator} from './lib/get_iterator'

/* eslint complexity: ['error', 4] */
/**
```
import {rateLimit} from 'async_iter/pipeline/rateLimit' # pipeline version
import {rateLimit} from 'async_iter/rateLimit' # conventional version
```
Emits the values from the source iteration at upto a limited rate

> Supports both **sync** and  **async** iterations.  Always returns an **async** iterator
<br/>
> The source iteration will be consumed only as required - there is no queing within rateLimit function
<br/>
> The definition of unit is defined by the optional function `counter`. The default will be 1 iteration equals 1 unit

 * @param  {Iterable}         source        The source iteration to rate limit
 * @param {Number}   maxAmount     the maxmimum number of 'units' to be emitted within the time of `perPeriod`
 * @param {Number}   perPeriod     the period in milliseconds to be applied
 * @param {Function} [counter=]    an optional callback function, called for each item
 * @return {Iterable} The iterable that will not emit at a rate greater than specified
 * @function
 * @example
import {rateLimit} from 'async_iter/pipeline'

// Emit at no more than 5 characters per 2s
const items = ['first', 'second', 'third', 'fourth', 'fifth']
  |> rateLimit(5, 2000, v => v.toString().length)
 * @memberof module:Operators
 * @name rateLimit
 */
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
  } finally {
    clearInterval(interval)
  }
}
