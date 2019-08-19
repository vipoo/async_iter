import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {forEach} from 'async_iter/pipeline/for_each' # pipeline version
import {forEach} from 'async_iter/for_each' # conventional version
```
Calls the supplied function for each item within the source iterable
> Supports both **sync** and **async** iterations

 * @param {Iterable}       source          The source iteration
 * @param {itemCallback}   fn              Function to be called for each item
 * @returns {Iterable}     The source iteration
 * @function
 * @name forEach
 * @memberof module:Operators
 */

export const forEach = syncType(syncForEach, asyncForEach)

function syncForEach(source, fn) {
  let index = 0
  for (const item of source)
    fn(item, index++)
}

async function asyncForEach(source, fn) {
  source = await asAsyncIterator(source)

  let index = 0
  for await (const item of source)
    await fn(item, index++)
}
