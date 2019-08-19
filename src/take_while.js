import {syncType, asAsyncIterator} from './lib/get_iterator'

/**
```
import {takeWhile} from 'async_iter/pipeline/take_while' # pipeline version
import {takeWhile} from 'async_iter/take_while' # conventional version
```
 Takes a number of items from the source iteration

 > Supports both **sync** and **async** iterations

 * @param {Iterable}      source    The source iteration
 * @param {evaluateItem}  fn        Called for each item.  When function returns false, iteration is stopped
 * @returns {Iterable} A set containing all items of source, upto when fn returns false (non inclusive)
 * @name takeWhile
 * @function
 * @memberof module:Operators
 * @name takeWhile
 */

export const takeWhile = syncType(syncTakeWhile, asyncTakeWhile)

function* syncTakeWhile(source, fn) {
  for (const x of source) {
    if (!fn(x))
      return
    yield x
  }
}

async function* asyncTakeWhile(source, fn) {
  source = await asAsyncIterator(source)

  for await (const x of source) {
    if (!await fn(x))
      return
    yield x
  }
}
