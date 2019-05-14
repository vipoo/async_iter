import {asAsyncIterator} from './lib/get_iterator'

export function take(source, count) {
  if (!source.then && source[Symbol.iterator])
    return syncTake(source, count)

  return asyncTake(source, count)
}

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
