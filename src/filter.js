import {asAsyncIterator} from './lib/get_iterator'

export async function* filter(source, fn) {
  source = await asAsyncIterator(source)

  for await (const x of source)
    if (await fn(x))
      yield x
}
