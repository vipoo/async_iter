import {syncType, asAsyncIterator} from './lib/get_iterator'

/**
```
import {takeUntil} from 'async_iter/pipeline/take_until' # pipeline version
import {takeUntil} from 'async_iter/take_until' # conventional version
```
 Takes a number of items from the source iteration

 > Supports both **sync** and **async** iterations

 * @param {Iterable}      source    The source iteration
 * @param {evaluateItem}  fn        Called for each item.  When function returns true, iteration is stopped.
 * @returns {Iterable} A set containing all items of source, upto when fn returns true (non inclusive)
 * @name takeUntil
 * @function
 * @example
 * @memberof module:Operators
 * @name takeUntil
 */

export const takeUntil = syncType(syncTakeUntil, asyncTakeUntil)

function* syncTakeUntil(source, fn) {
  for (const x of source) {
    if (fn(x))
      return
    yield x
  }
}

async function* asyncTakeUntil(source, fn) {
  source = await asAsyncIterator(source)

  for await (const x of source) {
    if (await fn(x))
      return
    yield x
  }
}
