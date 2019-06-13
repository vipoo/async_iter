import {pump} from './pump'

export function timeout(period, timeoutMarker = 'Timeout', cancelHook = undefined) {

  const interval = period >= 1000 ? 1000 : period
  let periodCount = period >= 1000 ? period / 1000 : 1

  let aborted = false
  if (cancelHook)
    cancelHook(() => aborted = true)

  return pump(async (target, hasStopped) => {
    await target.next()

    let timer = setTimeout(timerTest, interval)
    function timerTest() {
      if (aborted)
        return target.return()

      if (periodCount-- > 0) {
        timer = setTimeout(timerTest, interval)
        return
      }

      if (timeoutMarker instanceof Error)
        target.throw(timeoutMarker)
      else
        target.next(timeoutMarker)
      target.return()
    }

    hasStopped.then(() => clearTimeout(timer))
  })
}
