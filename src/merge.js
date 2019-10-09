import {asAsyncIterator} from './lib/get_iterator'

/**
```
import {merge} from 'async_iter/pipeline/merge' # pipeline version
import {merge} from 'async_iter/merge' # conventional version
```

Merges the source iterables items into a single iterable.  Order is as they come.

If all source iterables are stopped, then the returned iteration is stopped

If the consumer stops the iteration, all source iterations are stopped.

 * @param  {Iterable}         sources        The source iterations
 * @return {Iterable} An iterable that combines all values from the sources
 * @function
 * @name merge
 * @memberof module:Operators
 */

export async function* merge(...sources) {
  let done = sources.length
  const items = sources
    .map(s => asAsyncIterator(s))
    .map((p, index) => p.next().then(d => ({...d, index})))

  try {
    while (done > 0) {
      const p = await Promise.race(items.filter(i => i))

      if (p.done) {
        done -= 1
        delete items[p.index]
      } else {
        items[p.index] = sources[p.index].next().then(d => ({...d, index: p.index}))
        yield p.value
      }
    }
  } finally {
    for (const item of sources.filter(i => i.return))
      item.return()
  }
}
