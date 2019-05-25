import {syncType, asAsyncIterator} from './lib/get_iterator'

export const takeUntil = syncType(syncTakeUntil, asyncTakeUntil)

function* syncTakeUntil(source, fn) {
  for (const x of source) {
    if (fn(x))
      return
    yield x
  }
}

async function* asyncTakeUntil(source, fn) {
  source = await asAsyncIterator(source)

  for await (const x of source) {
    if (await fn(x))
      return
    yield x
  }
}
