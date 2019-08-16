import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {concat} from 'async_iter/pipeline/concat' # pipeline version
import {concat} from 'async_iter/concat' # conventional version
```

Combines multiple source iterations into a single iteration
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         sources        The source iterations
 * @return {Iterable} An iterable that combines all values from the sources
 * @function
 * @name concat
 * @memberof module:Operators
*/

export const concat = syncType(syncConcat, asyncConcat)

function* syncConcat(...sources) {
  for (const s of sources)
    yield* s
}

async function* asyncConcat(...sources) {
  sources = sources.map(s => asAsyncIterator(s))
  for await (const source of sources)
    yield* (await source)
}
