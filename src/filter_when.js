import {asAsyncIterator, syncType} from './lib/get_iterator'

export const filterWhen = syncType(syncFilterWhen, asyncFilterWhen)

/* eslint complexity: ['error', 6] */
function* syncFilterWhen(source, fn, missingValueFn = x => x) {
  let currentState = true
  let firstDropped = undefined
  let lastItem = undefined

  for (const x of source) {
    lastItem = x
    const newState = fn(x)

    if (currentState)
      if (newState)
        yield x
      else {
        firstDropped = x
        currentState = false
      }
    else if (newState) {
      currentState = true
      yield missingValueFn(firstDropped, x)
      firstDropped = undefined
    }
  }

  if (!currentState)
    yield missingValueFn(firstDropped, lastItem)
}

async function* asyncFilterWhen(source, fn, missingValueFn = x => x) {
  source = await asAsyncIterator(source)

  let currentState = true
  let firstDropped = undefined
  let lastItem = undefined

  for await (const x of source) {
    lastItem = x
    const newState = await fn(x)

    if (currentState)
      if (newState)
        yield x
      else {
        firstDropped = x
        currentState = false
      }
    else if (newState) {
      currentState = true
      yield missingValueFn(firstDropped, x)
      firstDropped = undefined
    }
  }

  if (!currentState)
    yield missingValueFn(firstDropped, lastItem)
}
