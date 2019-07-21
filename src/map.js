import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {map} from 'async_iter/pipeline/map' # pipeline version
import {map} from 'async_iter/map' # conventional version
```
Transforms each item in the supplied iteration using the supplied function
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source        The source iteration to map
 * @param  {Function}         fn            The mapping function for each item
 * @return {Iterable} The transformed items
 * @function
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
