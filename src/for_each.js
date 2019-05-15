import {asAsyncIterator} from './lib/get_iterator'

export async function forEach(source, fn) {
  source = await asAsyncIterator(source)

  for await (const item of source)
    await fn(item)
}
