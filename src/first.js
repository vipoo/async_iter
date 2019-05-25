import {asAsyncIterator, syncType} from './lib/get_iterator'

export const first = syncType(syncFirst, asyncFirst)

function syncFirst(source) {
  for (const item of source)
    return item
}

async function asyncFirst(source) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    return item
}
