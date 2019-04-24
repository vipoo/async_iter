import {interval, intervalNonQueuing, take} from '../..'

const delay = period => new Promise(res => setTimeout(res, period))

let lastTime
let startTime
function logTimeDiff(time) {
  const t = lastTime || startTime
  lastTime = time
  const diff = (time - t) / BigInt(1000000)
  const diffSinceStart =  (process.hrtime.bigint() - startTime) / BigInt(1000000)

  console.log(`Recevied interval of ${diff} at ${diffSinceStart}`)
}

async function simpleInterval() {
  lastTime = undefined
  startTime = process.hrtime.bigint()
  console.log('Simple Interval - 500ms')
  const items = await interval(500) |> take(?, 10)

  for await (const item of items)
    logTimeDiff(item)

  console.log('done....\n\n')
}

async function racingInterval() {
  lastTime = undefined
  startTime = process.hrtime.bigint()
  console.log('Racing Interval')
  const items = await interval(500) |> take(?, 10)

  for await (const item of items) {
    logTimeDiff(item) //All 10 intervals will still be processed.
    await delay(1000) //processing is longer than interval rate
  }

  console.log('done....\n\n')
}

async function nonQueingInterval() {
  lastTime = undefined
  startTime = process.hrtime.bigint()
  console.log('Non QueingInterval')
  const items = await intervalNonQueuing(500) |> take(?, 10)

  for await (const item of items) {
    logTimeDiff(item) //Some interval will be dropped
    await delay(1000) //processing is longer than interval rate
  }

  console.log('done....\n\n')
}

async function main() {
  await simpleInterval()
  await racingInterval()
  await nonQueingInterval()
}

main()
