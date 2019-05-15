import {asAsyncIterator} from './lib/get_iterator'

export async function* take(source, count) {
  source = await asAsyncIterator(source)

  for await (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}
