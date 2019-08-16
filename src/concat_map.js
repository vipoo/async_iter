import {syncType, asAsyncIterator} from './lib/get_iterator'

/**
```
import {concatMap} from 'async_iter/pipeline/concat_map' # pipeline version
import {concatMap} from 'async_iter/concat_map' # conventional version
```
Joins an inner iterable with the use of a mapping function.

> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source        The source iteration
 * @param {Function} fn A function called for each item in the source iteration and returns an iterable
 * @return {F} An iterable that has flatten the inner iterable values
 * @function
 * @name concatMap
 * @memberof module:Operators
*/

export const mergeMap = syncType(syncMergeMap, asyncMergeMap)

export async function* asyncMergeMap(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    yield* await asAsyncIterator(await fn(item))
}

export function* syncMergeMap(source, fn) {
  for (const item of source)
    yield* fn(item)
}
