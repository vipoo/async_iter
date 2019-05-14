import {asAsyncIterator, syncType} from './lib/get_iterator'

export const filter = syncType(syncFilter, asyncFilter)

function* syncFilter(source, fn) {
  for (const x of source)
    if (fn(x))
      yield x
}

async function* asyncFilter(source, fn) {
  source = await asAsyncIterator(source)

  for await (const x of source)
    if (await fn(x))
      yield x
}
