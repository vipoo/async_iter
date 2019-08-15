import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {entries} from 'async_iter/pipeline/entries' # pipeline version
import {entries} from 'async_iter/entries' # conventional version
```
Equivalent to [Array.prototype.entries](https://devdocs.io/javascript/global_objects/array/entries)
> Supports both **sync** and **async** iterations

Emits the items with a key/value pair [index, value].

 * @param  {Iterable}         source        The source iteration to process
 * @return {Iterable} The transformed items
 * @function
 * @name entries
 */

export const entries = syncType(syncEntries, asyncEntries)

function* syncEntries(source) {
  let index = 0
  for (const item of source)
    yield [index++, item]
}

async function* asyncEntries(source) {
  source = await asAsyncIterator(source)

  let index = 0
  for await (const item of source)
    yield [index++, item]
}
