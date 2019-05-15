import {asAsyncIterator} from './lib/get_iterator'

export async function* tap(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source) {
    await fn(item)
    yield item
  }
}
