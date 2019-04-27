import {createLatch} from './latch'

function defaultMarker() {
  return process.hrtime.bigint()
}

export async function interval(period, fn = defaultMarker) {
  const {push, items, hasStopped} = await createLatch()
  let intervalHandle = undefined
  let currentPromise = undefined
  const intervalFunction = async () => {
    if (currentPromise)
      return

    currentPromise = push(await fn())
    await currentPromise
    currentPromise = null
  }

  hasStopped.then(() => clearInterval(intervalHandle))

  intervalHandle = setInterval(intervalFunction, period)

  return items()
}
