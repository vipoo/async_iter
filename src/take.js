import {syncType, asAsyncIterator} from './lib/get_iterator'

export const take = syncType(syncTake, asyncTake)

function* syncTake(source, count) {
  if (count === 0)
    return
  for (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}

async function* asyncTake(source, count) {
  if (count === 0)
    return
  source = await asAsyncIterator(source)

  for await (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}
