import {pump} from './pump'

export function timeout(period, timeoutMarker = 'Timeout') {
  return pump(async (target, hasStopped) => {
    await target.next()
    const timer = setTimeout(() => {
      if (timeoutMarker instanceof Error)
        target.throw(timeoutMarker)
      else
        target.next(timeoutMarker)
      target.return()
    }, period)
    hasStopped.then(() => clearTimeout(timer))
  })
}
