import {pump} from './pump'

export function timeout(period, timeoutMarker = 'Timeout') {

  const interval = period >= 1000 ? 1000 : period
  let periodCount = period >= 1000 ? period / 1000 : 1

  return pump(async (target, hasStopped) => {
    await target.next()

    let timer = setTimeout(timerTest, interval)
    function timerTest() {
      if (periodCount-- > 0)
        timer = setTimeout(timerTest, interval)

      if (timeoutMarker instanceof Error)
        target.throw(timeoutMarker)
      else
        target.next(timeoutMarker)
      target.return()
    }

    hasStopped.then(() => clearTimeout(timer))
  })
}
