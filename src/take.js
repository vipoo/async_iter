import {syncType, asAsyncIterator} from './lib/get_iterator'

/**
```
import {take} from 'async_iter/pipeline/take' # pipeline version
import {take} from 'async_iter/take' # conventional version
```
 Takes a number of items from the source iteration

 > Supports both **sync** and **async** iterations

 * @param {Iterable} source   The source iteration
 * @param {Number} count      The number to take from the source
 * @returns {Iterable}        A set containing upto the <code>count</code> of items
 * @name take
 * @function
 * @example
import {take} from 'async_iter'

const items = take([1, 2, 3, 4, 5], 3)

for await (const item of items)
  console.log(item)
 * @memberof module:Operators
 * @name take
 */
export const take = syncType(syncTake, asyncTake)

function* syncTake(source, count) {
  if (count === 0)
    return
  for (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}

async function* asyncTake(source, count) {
  if (count === 0)
    return
  source = await asAsyncIterator(source)

  for await (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}
