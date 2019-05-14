import {syncType, asAsyncIterator} from './lib/get_iterator'

export const take = syncType(syncTake, asyncTake)

function* syncTake(source, count) {
  for (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}

async function* asyncTake(source, count) {
  source = await asAsyncIterator(source)

  for await (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}
