import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {every} from 'async_iter/pipeline/every' # pipeline version
import {every} from 'async_iter/every' # conventional version
```
Return true if every item satisfies the supplied test function
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source        The source iteration to be tested
 * @param  {itemTest}         fn            A function called for each item in the source
 * @return {Boolean} True if all items are satisfied
 * @function
 * @name every
*/

export const every = syncType(syncevery, asyncevery)

function syncevery(source, fn) {
  let index = 0
  for (const item of source)
    if (!fn(item, index++))
      return false

  return true
}

async function asyncevery(source, fn) {
  source = await asAsyncIterator(source)

  let index = 0
  for await (const item of source)
    if (!fn(item, index++))
      return false

  return true
}
