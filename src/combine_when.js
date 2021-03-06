import {syncType, asAsyncIterator} from './lib/get_iterator'

/**
```
import {map} from 'async_iter/pipeline/combineWhen' # pipeline version
import {map} from 'async_iter/combineWhen' # conventional version
```
Collect items, `combining` them, until the evaluation function return true.
> Supports both **sync** and **async** iterations

* @param  {Iterable}         source        The source iteration to process
* @param {evaluateItem} fn                 A evaluator function, that upon returing true, causes all items collected to this point to be emitted
* @param {Function} combine                An optional function to combine two items (defaults to (a, b) => a + b)
* @return {Iterable} Emits as per the combindation functions
* @function
* @name combineWhen
* @memberof module:Operators
*/

export const combineWhen = syncType(syncCombineWhen, asyncCombineWhen)

function* syncCombineWhen(source, fn, combine = (a, b) => b + a) {
  let currentPending = undefined
  let pending = false
  for (const x of source) {
    if (fn(x)) {
      if (pending)
        yield currentPending
      currentPending = x
    } else
      currentPending = combine(x, currentPending)

    pending = true
  }

  yield currentPending
}

async function* asyncCombineWhen(source, fn, combine = (a, b) => b + a) {
  source = await asAsyncIterator(source)

  let currentPending = undefined
  let pending = false
  for await (const x of source) {
    if (await fn(x)) {
      if (pending)
        yield currentPending
      currentPending = x
    } else
      currentPending = await combine(x, currentPending)

    pending = true
  }

  yield currentPending
}
