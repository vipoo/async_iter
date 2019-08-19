import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {find} from 'async_iter/pipeline/find' # pipeline version
import {find} from 'async_iter/find' # conventional version
```
Return the first item in the source iterations, when the supplied function returns true
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source          The source iteration
 * @param  {itemTest}         fn              A function invokved for each item until true is returned
 * @return {*} The found item or undefined if nothing found
 * @function
 * @name find
 * @memberof module:Operators
 */

export const find = syncType(syncfind, asyncfind)

function syncfind(source, fn) {
  for (const item of source)
    if (fn(item))
      return item
}

async function asyncfind(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    if (fn(item))
      return item
}
