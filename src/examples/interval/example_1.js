import {interval, take} from '../../pipeline/browsers'

/**
 * Example usage of the interval generator
 * @name example_1
 * @memberof module:interval-examples
 * @function
 */

const delay = period => new Promise(res => setTimeout(res, period))

let startTime
let count = 1
function logTimeDiff() {
  const diffSinceStart = (new Date().getTime()) - startTime

  console.log(`Received interval count: ${count++}`)
  console.error(`Diff: ${diffSinceStart}`)
}

async function simpleInterval() {
  startTime = new Date().getTime()
  console.log('Simple Interval - 50ms')
  const items = await interval(5) |> take(10)

  for await (const item of items)
    logTimeDiff(item)

  console.log('done....\n\n')
}

async function nonQueingInterval() {
  startTime = new Date().getTime()
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
