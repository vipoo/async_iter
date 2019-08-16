import {asAsyncIterator, syncType} from './lib/get_iterator'
import {syncBy, syncByComp, syncValue, asyncBy, asyncByComp, asyncValue} from './lib/min_max_support'

/**
```
import {min} from 'async_iter/pipeline/min' # pipeline version
import {min} from 'async_iter/min' # conventional version
```
Returns the min value of the source iterable items
> Supports both **sync** and **async** iterations

 * @param {Iterable}         source          The source iteration
 * @param {minMaxCallback=} fn An function to determine value order
 * @return {*} The min item
 * @function
 * @name min
 * @memberof module:Operators
 */

export const min = syncType(syncMin, asyncMin)

const syncMinBy = (source, fn) => syncBy((a, b) => a > b, source, fn)
const syncMinByComp = (source, fn) => syncByComp(a => a < 0, source, fn)
const syncMinValue = source => syncValue((a, b) => a > b, source)

const asyncMinBy = (source, fn) => asyncBy((a, b) => a > b, source, fn)
const asyncMinByComp = (source, fn) => asyncByComp(a => a < 0, source, fn)
const asyncMinValue = source => asyncValue((a, b) => a > b, source)

function syncMin(source, fn) {
  if (!fn)
    return syncMinValue(source)

  if (fn.length >= 2)
    return syncMinByComp(source, fn)

  return syncMinBy(source, fn)
}

async function asyncMin(source, fn) {
  source = await asAsyncIterator(source)

  if (!fn)
    return asyncMinValue(source)

  if (fn.length >= 2)
    return asyncMinByComp(source, fn)

  return asyncMinBy(source, fn)
}
