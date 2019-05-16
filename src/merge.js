import {asAsyncIterator} from './lib/get_iterator'

export async function* merge(...sources) {
  let done = sources.length
  const items = sources
    .map(s => asAsyncIterator(s))
    .map((p, index) => p.next().then(d => ({...d, index})))

  while (done > 0) {
    const p = await Promise.race(items.filter(i => i))

    if (p.done) {
      done -= 1
      delete items[p.index]
    }
    else {
      items[p.index] = sources[p.index].next().then(d => ({...d, index: p.index}))
      yield p.value
    }
  }
}
