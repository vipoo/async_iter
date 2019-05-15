import 'source-map-support/register'
import {persisted} from '../..'
import rmfr from 'rmfr'
import {promiseSignal} from '../../lib/promise_helpers'

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
  const items = await persisted(source('a', true), './tmp/buffering_example')
  let count = 0

  const p = promiseSignal()
  process.nextTick(async () => {
    for await (const item of items) {
      console.log('a', item.value.toString())
      item.completed()

      if (count++ >= 1) {
        console.log('------')
        p.res()
        await delay(2000)
        break
      }
    }
  })

  await p.promise
}

async function resumeIteration() {
  const items = await persisted(source('b', false), './tmp/buffering_example')

  for await (const item of items) {
    console.log('b', item.value.toString())
    item.completed()
  }

  console.log('done....')
}

rmfr('./tmp').then(() => persistHalfIteration()).then(() => resumeIteration())
