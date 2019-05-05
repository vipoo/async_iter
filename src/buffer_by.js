import {deferredPromise} from './promise_helpers'
import {asAsyncIterator} from './lib/get_iterator'

const True = true

function timeoutTrigger(state, period) {
  clearTimeout(state.timerHandle)
  const timeout = deferredPromise()
  state.timerHandle = setTimeout(() => timeout.res(), period)
  state.promise = timeout.promise.then(() => ({timed: true}))
}

function returnLastValue(state) {
  if (state.buffer.length > 0) {
    state.donedone = true
    const emittedValue = state.buffer
    state.buffer = []
    return {value: emittedValue, done: false}
  }
  return {done: true}
}

function pushValue(state, value) {
  state.buffer.push(value)
  state.nextValue = undefined
}

function packageNextEmit(state, period) {
  const emittedValue = state.buffer
  state.buffer = []
  timeoutTrigger(state, period)
  if (emittedValue.length > 0)
    return {value: emittedValue, done: false}
}

export async function bufferBy(source, trigger, maxWaitTime) {
  source = await source

  const state = {
    buffer: [],
    nextValue: undefined,
    donedone: false,
    timeout: undefined
  }

  /* eslint complexity: ['error', 9] */
  return asAsyncIterator({
    [Symbol.asyncIterator]() {
      return {
        async next() {
          if (state.donedone)
            return {done: true}

          timeoutTrigger(state, maxWaitTime)

          while (True) {
            state.nextValue = state.nextValue || source.next()
            const {value, done, timed} = await Promise.race([state.nextValue, state.promise])
            if (done)
              return returnLastValue(state)

            let emittedValue = undefined
            if (timed || trigger(value, [...state.buffer, value]))
              if (emittedValue = packageNextEmit(state, maxWaitTime))
                return emittedValue

            if (!timed)
              pushValue(state, value)
          }
        },
        async return() {
          source.return()
          return {done: true}
        }
      }
    }
  })
}
