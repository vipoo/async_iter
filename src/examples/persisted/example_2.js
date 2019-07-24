import 'source-map-support/register'
import {persisted} from '../../pipeline'
import rmfr from 'rmfr'
import {promiseSignal} from '../../lib/promise_helpers'

/**
 * Example usage of the persisted function
 * @name example_2
 * @memberof module:persisted-examples
 * @function
 */

const delay = period => new Promise(res => setTimeout(res, period))

async function* source(code, neverEnd = true) {
  let c = 1
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`

  while (neverEnd)
    yield await delay(100).then(() => 'waiting...')
}

// Part process, then simulate 'crash' or abort
async function persistHalfIteration() {
  const items = await (source('a', true) |> persisted('./tmp/buffering_example'))
  let count = 0

  const p = promiseSignal()
  process.nextTick(async () => {
    for await (const item of items) {
      console.log('a', item.value.toString())
      item.completed()

      if (count++ >= 1) {
        console.log('------')
        p.res()
        await delay(20)
        break
      }
    }
  })

  await p.promise
}

async function resumeIteration() {
  const items = await (source('b', false) |> persisted('./tmp/buffering_example'))

  for await (const item of items) {
    console.log('b', item.value.toString())
    item.completed()
  }

  console.log('done....')
}

rmfr('./tmp').then(() => persistHalfIteration()).then(() => resumeIteration())
