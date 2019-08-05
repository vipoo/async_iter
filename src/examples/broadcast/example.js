import {range, broadcast, map} from '../../pipeline/browsers'
import {promiseSignal} from '../../lib/promise_helpers'

/**
 * Example usage of the broadcast function
 * @name example
 * @memberof module:broadcast-examples
 * @function
 */
export async function main() {

  const items = range({start: 1, end: 10})
    |> map(x => {
      if (x === 6)
        throw new Error('blah')
      return x
    })
    |> broadcast()

  const job1 = await promiseSignal()
  process.nextTick(async () => {
    try {
      for await (const item of items())
        console.log('consumer A:', item)
    } catch (err) {
      console.log('consumer A errored', err.message)
    } finally {
      job1.res()
    }
  })

  const job2 = await promiseSignal()
  process.nextTick(async () => {
    try {
      for await (const item of items()) {
        console.log('consumer B:', item)
        if (item === 3)
          break
      }
    } catch (err) {
      console.log('consumer B errored', err.message)
    } finally {
      job2.res()
    }
  })

  await Promise.all([job1.promise, job2.promise])
  console.log('done....')
}

export default main()
