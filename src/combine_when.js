import {syncType, asAsyncIterator} from './lib/get_iterator'

export const combineWhen = syncType(syncCombineWhen, asyncCombineWhen)

function* syncCombineWhen(source, fn, combine = (a, b) => b + a) {
  let currentPending = undefined
  let pending = false
  for (const x of source) {
    if (fn(x)) {
      if (pending)
        yield currentPending
      currentPending = x
    } else
      currentPending = combine(x, currentPending)

    pending = true
  }

  yield currentPending
}

async function* asyncCombineWhen(source, fn, combine = (a, b) => b + a) {
  source = await asAsyncIterator(source)

  let currentPending = undefined
  let pending = false
  for await (const x of source) {
    if (await fn(x)) {
      if (pending)
        yield currentPending
      currentPending = x
    } else
      currentPending = await combine(x, currentPending)

    pending = true
  }

  yield currentPending
}
