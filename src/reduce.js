import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {reduce} from 'async_iter/pipeline/reduce' # pipeline version
import {reduce} from 'async_iter/reduce' # conventional version
```
 * Apply reducer function to each item of the source iterable, returning the single reduce value
> Supports both **sync** and  **async** iterations.  Always returns an **async** iterator

 * @param  {Iterable}         source        The source iteration to rate limit
 * @param  {reducerCallback}  fn            The function to call for each item
 * @param  {*}                initialValue  The initial value to supply to the first call of fn
 * @return {*} The final reduced value
 * @function
 * @name reduce
 * @memberof module:Operators
 */

export const reduce = syncType(syncReduce, asyncReduce)

function syncReduce(source, fn, initialValue) {
  let index = 0
  let accumulator = initialValue
  for (const item of source)
    accumulator = fn(accumulator, item, index++)
  return accumulator
}

async function asyncReduce(source, fn, initialValue) {
  source = await asAsyncIterator(source)

  let index = 0
  let accumulator = initialValue
  for await (const item of source)
    accumulator = await fn(accumulator, item, index++)
  return accumulator
}
