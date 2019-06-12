import {asAsyncIterator, syncType} from './lib/get_iterator'

export const chunk = syncType(syncChunk, asyncChunk)

function* syncChunk(source, count) {
  const buffer = []
  for (const item of source) {
    buffer.push(item)
    if (buffer.length === count) {
      yield [...buffer]
      buffer.length = 0
    }
  }
}

async function* asyncChunk(source, count) {
  source = await asAsyncIterator(source)

  const buffer = []
  for await (const item of source) {
    buffer.push(item)
    if (buffer.length === count) {
      yield [...buffer]
      buffer.length = 0
    }
  }
}
