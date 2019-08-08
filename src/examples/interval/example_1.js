import {interval, take} from '../../pipeline/browsers'

/**
 * Example usage of the interval generator
 * @name example_1
 * @memberof module:interval-examples
 * @function
 */

const delay = period => new Promise(res => setTimeout(res, period))

let lastTime
let startTime
let count = 1
function logTimeDiff(time) {
  const t = lastTime || startTime
  lastTime = time
  const diff = (time - t) / BigInt(1000000)
  const diffSinceStart =  ( process.hrtime.bigint() - startTime) / BigInt(1000000)

  console.log(`Received interval count: ${count++}`)
  console.error(`Diff: ${diff} at ${diffSinceStart}`)
}

async function simpleInterval() {
  lastTime = undefined
  startTime = process.hrtime.bigint()
  console.log('Simple Interval - 50ms')
  const items = await interval(5) |> take(10)

  for await (const item of items)
    logTimeDiff(item)

  console.log('done....\n\n')
}

async function nonQueingInterval() {
  lastTime = undefined
  startTime = process.hrtime.bigint()
  console.log('Non QueingInterval')
  const items = await (interval(5) |> take(10))

  for await (const item of items) {
    logTimeDiff(item) //Some interval will be dropped
    await delay(10) //processing is longer than interval rate
  }

  console.log('done....\n\n')
}

export async function main() {
  await simpleInterval()
  await nonQueingInterval()
}

export default main()
