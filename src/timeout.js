import {pump} from './pump'

export function timeout(period, timeoutMarker = 'Timeout') {
  return pump(async (target, hasStopped) => {
    await target.next()
    const timer = setTimeout(() => {
      target.next(timeoutMarker)
      target.return()
    }, period)
    hasStopped.then(() => clearTimeout(timer))
  })
}
