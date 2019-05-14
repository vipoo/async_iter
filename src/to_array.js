import {asAsyncIterator, syncType} from './lib/get_iterator'

export const toArray = syncType(syncToArray, asyncToArray)

function syncToArray(source) {
  const result = []
  for (const item of source)
    result.push(item)

  return result
}

async function asyncToArray(source) {
  source = await asAsyncIterator(source)

  const result = []
  for await (const item of source)
    result.push(item)

  return result
}
