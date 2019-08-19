import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {tap} from 'async_iter/pipeline/tap' # pipeline version
import {tap} from 'async_iter/tap' # conventional version
```
Call a side effect function for each item in the iteration.  The returned value is ignored
> Supports both **sync** and **async** iterations

 * @param {Iterable}          source          The source iteration
 * @param {itemCallback}   fn              Function to be called for each item
 * @return {void}
 * @function
 * @name tap
 * @memberof module:Operators
 */

export const tap = syncType(syncTap, asyncTap)

function* syncTap(source, fn) {
  for (const item of source) {
    fn(item)
    yield item
  }
}

async function* asyncTap(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source) {
    await fn(item)
    yield item
  }
}
