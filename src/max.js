import {asAsyncIterator, syncType} from './lib/get_iterator'
import {syncBy, syncByComp, syncValue, asyncBy, asyncByComp, asyncValue} from './lib/min_max_support'

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
