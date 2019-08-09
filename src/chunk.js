import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {map} from 'async_iter/pipeline/chunk' # pipeline version
import {map} from 'async_iter/chunk' # conventional version
```
Emit a batch of `count` items from the source iterable

> Supports both **sync** and **async** iterations

* @param  {Iterable}         source        The source iteration to process
* @param  {Number}           count         The number of items to be batched together into a single value
* @return {Iterable} The chunked items
* @function
* @name chunk
*/

export const chunk = syncType(syncChunk, asyncChunk)

function* syncChunk(source, count) {
  const buffer = []
  for (const item of source) {
    buffer.push(item)
    if (buffer.length === count) {
      yield [...buffer]
      buffer.length = 0
    }
  }
}

async function* asyncChunk(source, count) {
  source = await asAsyncIterator(source)

  const buffer = []
  for await (const item of source) {
    buffer.push(item)
    if (buffer.length === count) {
      yield [...buffer]
      buffer.length = 0
    }
  }
}
