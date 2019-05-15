import {asAsyncIterator} from './lib/get_iterator'

export async function toArray(source) {
  source = await asAsyncIterator(source)

  const result = []
  for await (const item of source)
    result.push(item)

  return result
}
