import {asAsyncIterator, syncType} from './lib/get_iterator'
import {syncBy, syncByComp, syncValue, asyncBy, asyncByComp, asyncValue} from './lib/min_max_support'

/**
```
import {max} from 'async_iter/pipeline/max' # pipeline version
import {max} from 'async_iter/max' # conventional version
```
Returns the max value of the source iterable items
> Supports both **sync** and **async** iterations

 * @param {Iterable}         source          The source iteration
 * @param {minMaxCallback=} fn An function to determine value order
 * @return {*} The max item
 * @function
 * @name max
 * @memberof module:Operators
 */

export const max = syncType(syncMax, asyncMax)

const syncMaxBy = (source, fn) => syncBy((a, b) => a < b, source, fn)
const syncMaxByComp = (source, fn) => syncByComp(a => a > 0, source, fn)
const syncMaxValue = source => syncValue((a, b) => a < b, source)

const asyncMaxBy = (source, fn) => asyncBy((a, b) => a < b, source, fn)
const asyncMaxByComp = (source, fn) => asyncByComp(a => a > 0, source, fn)
const asyncMaxValue = source => asyncValue((a, b) => a < b, source)

function syncMax(source, fn) {
  if (!fn)
    return syncMaxValue(source)

  if (fn.length >= 2)
    return syncMaxByComp(source, fn)

  return syncMaxBy(source, fn)
}

async function asyncMax(source, fn) {
  source = await asAsyncIterator(source)

  if (!fn)
    return asyncMaxValue(source)

  if (fn.length >= 2)
    return asyncMaxByComp(source, fn)

  return asyncMaxBy(source, fn)
}
