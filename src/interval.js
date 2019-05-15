import {pump} from './pump'

function defaultMarker() {
  return process.hrtime.bigint()
}

export async function interval(period, fn = defaultMarker) {
  return pump(target => {
    let intervalHandle = undefined
    let currentPromise = undefined
    const intervalFunction = async () => {
      if (currentPromise)
        return

      const v = await fn()
      currentPromise = await target.next(v)
      if (currentPromise.done) {
        currentPromise = null
        clearInterval(intervalHandle)
        await target.return()
      }
      currentPromise = null
    }

    intervalHandle = setInterval(intervalFunction, period)
  })
}
