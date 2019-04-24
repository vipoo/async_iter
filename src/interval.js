import {createLatch} from './latch'

function defaultMarker() {
  return (typeof process !== 'undefined') ? process.hrtime.bigint() : Date.now()
}

export async function interval(period, fn = defaultMarker) {
  const {push, items, hasStoppedConsuming} = await createLatch()

  let intervalHandle = undefined
  const intervalFunction = async () => {
    if (hasStoppedConsuming()) {
      clearInterval(intervalHandle)
      return
    }
    push(fn())
  }

  intervalHandle = setInterval(intervalFunction, period)

  return items()
}

export async function intervalNonQueuing(period, fn = defaultMarker) {
  const {push, items, hasStoppedConsuming} = await createLatch()
  let intervalHandle = undefined
  let currentPromise = undefined
  const intervalFunction = async () => {
    if (hasStoppedConsuming()) {
      clearInterval(intervalHandle)
      return
    }

    if (currentPromise)
      return

    currentPromise = push(await fn())
    await currentPromise
    currentPromise = null
  }

  intervalHandle = setInterval(intervalFunction, period)

  return items()
}
