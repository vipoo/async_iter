import {asAsyncIterator, syncType} from './lib/get_iterator'

export const tap = syncType(syncTap, asyncTap)

function* syncTap(source, fn) {
  for (const item of source) {
    fn(item)
    yield item
  }
}

async function* asyncTap(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source) {
    await fn(item)
    yield item
  }
}
