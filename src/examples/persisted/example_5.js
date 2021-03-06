import {persisted} from '../../pipeline'
import rmfr from 'rmfr'

async function* source() {
  yield await Buffer.from('A buffer')
  yield await 'a string'
}

async function main() {
  const items = await (source() |> persisted('./tmp/buffering_example'))

  for await (const item of items) {
    console.log(item.value.toString())
    item.completed()
  }

  console.log('done....')
}

rmfr('./tmp').then(() => main())
