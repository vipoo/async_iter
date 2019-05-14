import {asAsyncIterator, syncType} from './lib/get_iterator'

export const map = syncType(syncMap, asyncMap)

function* syncMap(source, fn) {
  let count = 0
  for (const item of source)
    yield fn(item, count++)
}

async function* asyncMap(source, fn) {
  source = await asAsyncIterator(source)
  let count = 0
  for await (const item of source)
    yield fn(item, count++)
}
