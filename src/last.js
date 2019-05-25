import {asAsyncIterator, syncType} from './lib/get_iterator'

export const last = syncType(syncLast, asyncLast)

function syncLast(source) {
  let currentItem
  for (const item of source)
    currentItem = item

  return currentItem
}

async function asyncLast(source) {
  source = await asAsyncIterator(source)

  let currentItem
  for await (const item of source)
    currentItem = item

  return currentItem
}
