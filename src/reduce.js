import {asAsyncIterator, syncType} from './lib/get_iterator'

export const reduce = syncType(syncReduce, asyncReduce)

function syncReduce(source, fn, total) {
  let index = 0
  for (const item of source)
    total = fn(total, item, index++)
  return total
}

async function asyncReduce(source, fn, total) {
  source = await asAsyncIterator(source)

  let index = 0
  for await (const item of source)
    total = await fn(total, item, index++)
  return total
}
