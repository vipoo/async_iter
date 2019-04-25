import {getIterator} from './lib/get_iterator'

export async function forEach(source, fn) {
  source = getIterator(source)

  for await (const item of source)
    await fn(item)
}
