import {persisted} from '../../persisted'
import rmfr from 'rmfr'

async function* source() {
  yield await process.hrtime.bigint()
  yield await process.hrtime.bigint()
  yield await process.hrtime.bigint()
  yield await process.hrtime.bigint()
}

async function main() {
  const items = await persisted(source(), './tmp/buffering_example')

  for await (const item of items) {
    console.log(item.value.toString())
    item.completed()
  }

  console.log('done....')
}

rmfr('./tmp').then(() => main())
