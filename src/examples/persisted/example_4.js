import {persisted} from '../../pipeline'
import rmfr from 'rmfr'

async function* source(code) {
  let c = 1
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`
  yield await `${code}-${c++}`
}

async function iterate(code) {
  const items = await (source(code) |> persisted('./tmp/buffering_example'))

  for await (const item of items) {
    console.log(code, item.value.toString())
    item.completed()
  }

  console.log('done....')
}

rmfr('./tmp').then(() => iterate('a')).then(() => iterate('b'))
