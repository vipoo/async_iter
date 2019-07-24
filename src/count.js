import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {count} from 'async_iter/pipeline/count' # pipeline version
import {count} from 'async_iter/count' # conventional version
```
Iterates thru the supplied iterable's set and returns the count
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source        The source iteration to count
 * @return {Number} The count of items
 * @function
 * @name count
*/

export const count = syncType(syncCount, asyncCount)

function syncCount(source) {
  let count = 0
  for (const item of source) // eslint-disable-line no-unused-vars
    count++

  return count
}

async function asyncCount(source) {
  source = await asAsyncIterator(source)

  let count = 0
  for await (const item of source) // eslint-disable-line no-unused-vars
    count++
  return count
}
