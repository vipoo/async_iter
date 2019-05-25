import {asAsyncIterator} from './lib/get_iterator'

export async function* mergeMap(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    yield* await asAsyncIterator(await fn(item))
}
