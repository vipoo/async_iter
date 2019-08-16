import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {first} from 'async_iter/pipeline/first' # pipeline version
import {first} from 'async_iter/first' # conventional version
```
Returns the first item of the source iterable
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source          The source iteration
 * @return {*} The first item
 * @function
 * @name first
 * @memberof module:Operators
 */

export const first = syncType(syncFirst, asyncFirst)

function syncFirst(source) {
  for (const item of source)
    return item
}

async function asyncFirst(source) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    return item
}
