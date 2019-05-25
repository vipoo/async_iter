import {syncType, asAsyncIterator} from './lib/get_iterator'

export const takeWhile = syncType(syncTakeWhile, asyncTakeWhile)

function* syncTakeWhile(source, fn) {
  for (const x of source) {
    if (!fn(x))
      return
    yield x
  }
}

async function* asyncTakeWhile(source, fn) {
  source = await asAsyncIterator(source)

  for await (const x of source) {
    if (!await fn(x))
      return
    yield x
  }
}
