import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {toArray} from 'async_iter/pipeline/to_array' # pipeline version
import {toArray} from 'async_iter/to_array' # conventional version
```
 Converts an iterable source to an array

 > Supports both **sync** and **async** iterations

 * @param {Iterable} source   The source iteration
 * @returns {Array}        An array containing all the items of the source iteration
 * @name toArray
 * @function
 * @memberof module:Operators
 * @name toArray
 */

export const toArray = syncType(syncToArray, asyncToArray)

function syncToArray(source) {
  const result = []
  for (const item of source)
    result.push(item)

  return result
}

async function asyncToArray(source) {
  source = await asAsyncIterator(source)

  const result = []
  for await (const item of source)
    result.push(item)

  return result
}
