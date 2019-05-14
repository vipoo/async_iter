import {asAsyncIterator} from './lib/get_iterator'

export function map(source, count) {
  if (!source.then && source[Symbol.iterator])
    return syncMap(source, count)

  return asyncMap(source, count)
}

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
