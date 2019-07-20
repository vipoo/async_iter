import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
 * Transforms each item in the supplied iteration using the supplied function
 * @param  {Iterable}         source        The source iteration to map
 * @param  {Function}         fn            The mapping function for each item
 * @return {Iterable} The transformed items
 * @function
 * @memberOf module:IteratorFunctions
 * @name map
 */
export const map = syncType(syncMap, asyncMap)

function* syncMap(source, fn) {
  let count = 0
  for (const item of source)
    yield fn(item, count++)
}

async function* asyncMap(source, fn) {
  source = await asAsyncIterator(source)
  let count = 0
  for await (const item of source)
    yield fn(item, count++)
}
