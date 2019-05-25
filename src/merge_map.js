import {syncType, asAsyncIterator} from './lib/get_iterator'

export const mergeMap = syncType(syncMergeMap, asyncMergeMap)

export async function* asyncMergeMap(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    yield* await asAsyncIterator(await fn(item))
}

export function* syncMergeMap(source, fn) {
  for (const item of source)
    yield* fn(item)
}
