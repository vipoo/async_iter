import {syncType, asAsyncIterator} from './lib/get_iterator'

/**
 * Takes a number of items from the source iteration
 * <br/>
 * Supports both sync and async iterations
 *
 * @param {Iterable} source   A source
 * @param {Number} count      The number to take from the source
 * @returns {Iterable}        A set containing upto the <code>count</code> of items
 * @memberOf module:IteratorFunctions
 * @name take
 * @function
 * @example
import {take} from 'async_iter'

const items = take([1, 2, 3, 4, 5], 3)

for await (const item of items)
  console.log(item)
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
