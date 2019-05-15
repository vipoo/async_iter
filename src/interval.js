import {pump} from './pump'

export function interval(period, cancel = new Promise(() => {})) {
  return pump(async target => {
    const result = await Promise.race([target.next(), cancel.then(() => ({done: true}))])
    if (result.done)
      return target.return()

    return new Promise(res => {
      cancel.then(() => {
        currentPromise = null
        clearInterval(intervalHandle)
        target.return()
        res()
      })
      let intervalHandle = undefined
      let currentPromise = undefined
      const intervalFunction = async () => {
        if (currentPromise)
          return

        const v = process.hrtime.bigint()
        currentPromise = await Promise.race([target.next(v), cancel.then(() => ({done: true}))])
        if (currentPromise.done) {
          currentPromise = null
          clearInterval(intervalHandle)
          await target.return()
          res()
        }
        currentPromise = null
      }

      intervalHandle = setInterval(intervalFunction, period)
    })
  })
}
