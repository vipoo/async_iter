import {asAsyncIterator} from './lib/get_iterator'

const True = true
const delay = period => new Promise(res => setTimeout(res, period))

export function bufferGroupBy(source, fn, trigger, maxWaitTime) {
  const state = {
    buffers: {},
    nextValue: undefined,
  }

  function emit(key) {
    const value = state.buffers[key].data
    delete state.buffers[key]
    return {value}
  }

  /* eslint complexity: ['error', 29] */
  return asAsyncIterator({
    [Symbol.asyncIterator]() {
      return {
        async next() {
          while (True) {
            state.nextValue = state.nextValue || source.next()
            const timers = Object.values(state.buffers).map(t => t.timer)
            const {value, done, timed} = await Promise.race([state.nextValue, ...timers])

            if (done) {
              const keys = Object.keys(state.buffers)
              if (keys.length === 0)
                return {done: true}

              return emit(keys[0])
            }

            if (timed)
              return emit(timed)

            const groupKey = fn(value)
            if (!state.buffers[groupKey])
              state.buffers[groupKey] = {
                timer: delay(maxWaitTime).then(() => ({timed: groupKey})),
                data: []
              }
            state.buffers[groupKey].data.push(value)
            state.nextValue = undefined

            if (trigger(value, state.buffers[groupKey].data))
              return emit(groupKey)
          }
        },
        async return() {
          state.buffers = {}
          state.nextValue = undefined
          source.return()
          return {done: true}
        }
      }
    }
  })
}
