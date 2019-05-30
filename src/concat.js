import {asAsyncIterator, syncType} from './lib/get_iterator'

export const concat = syncType(syncConcat, asyncConcat)

function* syncConcat(...sources) {
  for (const s of sources)
    yield* s
}

async function* asyncConcat(...sources) {
  sources = sources.map(s => asAsyncIterator(s))
  for await (const source of sources)
    yield* (await source)
}
