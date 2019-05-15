import {asAsyncIterator, syncType} from './lib/get_iterator'

export const forEach = syncType(syncForEach, asyncForEach)

function syncForEach(source, fn) {
  for (const item of source)
    fn(item)
}

async function asyncForEach(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    await fn(item)
}
