import {asAsyncIterator} from './lib/get_iterator'

export async function* map(source, fn) {
  source = await asAsyncIterator(source)
  let count = 0
  for await (const item of source)
    yield fn(item)
}
