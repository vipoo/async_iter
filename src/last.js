import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {last} from 'async_iter/pipeline/last' # pipeline version
import {last} from 'async_iter/last' # conventional version
```
Returns the last item of the source iterable
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source          The source iteration
 * @return {*} The last item
 * @function
 * @name last
 * @memberof module:Operators
 */

export const last = syncType(syncLast, asyncLast)

function syncLast(source) {
  let currentItem
  for (const item of source)
    currentItem = item

  return currentItem
}

async function asyncLast(source) {
  source = await asAsyncIterator(source)

  let currentItem
  for await (const item of source)
    currentItem = item

  return currentItem
}
