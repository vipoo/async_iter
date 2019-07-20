import {promiseSignal} from './lib/promise_helpers'
import {asAsyncIterator} from './lib/get_iterator'

const True = true

function timeoutTrigger(state, period) {
  clearTimeout(state.timerHandle)
  const timeout = promiseSignal()
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

/**
 * Collect a set of items from source.  Emit as an array of those items.
 * <br/>
 * The batch is produced, when the <code>triggerFn</code> returns true, or the <code>maxWaitTime</code> has elasped since the last emitted value
 * @param  {Iterable}         source            The source iteration to buffer
 * @param  {module:IteratorFunctions.triggerCallback}  trigger           Called for each item in the source iteration.  Return true to trigger a batch
 * @param  {Bumber}           maxWaitTime       period is milliseconds to trigger a batch, if no batch has been emitted and there are pending values
 * @return {Iterable} The buffered items
 * @memberOf module:IteratorFunctions
 * @name bufferBy
 * @function
 */
export async function bufferBy(source, trigger, maxWaitTime) {
  const state = {
    buffer: [],
    nextValue: undefined,
    donedone: false,
    timeout: undefined
  }

  source = await asAsyncIterator(source)

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
