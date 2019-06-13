import {pump} from './pump'
import {promiseSignal} from './lib/promise_helpers'

export function TimeoutCancel() {
  const cancelHook = promiseSignal()
  const result = () =>  cancelHook.res()
  result.cancelHook = cancelHook
  return result
}

class TimeoutIterationError extends Error {
  constructor() {
    super('Timeout Iteration')
  }
}

export function timeoutError(period, cancelHook = undefined) {
  return timeout(period, cancelHook, new TimeoutIterationError())
}

const TimeoutSymbol = Symbol('Timeout')

export function timeout(period, cancelHook = undefined, timeoutMarker = TimeoutSymbol) {

  return pump(async (target, hasStopped) => {
    await target.next()

    const timer = setTimeout(timerTest, period)
    function timerTest() {
      abortIteration(true)
    }

    function abortIteration(abort) {
      clearTimeout(timer)
      if (abort)
        if (timeoutMarker instanceof Error)
          target.throw(timeoutMarker)
        else
          target.next(timeoutMarker)

      target.return()
    }

    const p = cancelHook ? [hasStopped, cancelHook] : [hasStopped]
    Promise.race(p).then(() => abortIteration(false))
  })
}
