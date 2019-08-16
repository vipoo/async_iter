import {asAsyncIterator, syncType} from './lib/get_iterator'
import {asyncFilterWhen, syncFilterWhen} from './filter_when'

/**
```
import {filter} from 'async_iter/pipeline/filter' # pipeline version
import {filter} from 'async_iter/filter' # conventional version
```
Filters out items from the source iteration, based on the supplied test function
> Supports both **sync** and **async** iterations

 * @param  {Iterable}         source          The source iteration to filter
 * @param  {Function}         fn              A funntion invokved for each item, returning false for items to be removed
 * @param  {missingValueFn=}  missingValueFn  When supplied, will be invokved for each group of items that are filter - returns a item to be emitted, representing the filtered items
 * @return {Iterable} The filtered items
 * @function
 * @name filter
 * @memberof module:Operators
@description
The optional `missingValueFn` allows for processing the 'filtered' items into a single item.

eg: Given an input source of [1, 2, 3, 4, 5, 6] and a filter of x >= 5, then the missingValueFn will be called with
values of (1, 5) and the result of that function will be emitted before item 6.

The examples include use of the `missingValueFn` function
 */

export const filter = syncType(syncFilter, asyncFilter)

function* syncFilter(source, fn, missingValueFn = undefined) {
  if (missingValueFn !== undefined)
    return yield* syncFilterWhen(source, fn, missingValueFn)

  for (const x of source)
    if (fn(x))
      yield x
}

async function* asyncFilter(source, fn, missingValueFn = undefined) {
  if (missingValueFn !== undefined)
    return yield* asyncFilterWhen(source, fn, missingValueFn)

  source = await asAsyncIterator(source)

  for await (const x of source)
    if (await fn(x))
      yield x
}
