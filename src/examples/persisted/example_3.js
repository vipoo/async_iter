import {persisted} from '../../persisted'
import rmfr from 'rmfr'

const delay = period => new Promise(res => setTimeout(res, period))

async function* source() {
  yield await process.hrtime.bigint()
  yield await process.hrtime.bigint()
  yield await process.hrtime.bigint()
  yield await process.hrtime.bigint()

  while (true)
    yield await delay(100)
}

async function main() {
  const items = await persisted(source(), './tmp/buffering_example')

  let count = 0
  for await (const item of items) {
    console.log(item.value.toString())
    item.completed()

    if (count++ >= 2)
      break
  }

  console.log('done....')
}

rmfr('./tmp').then(() => main())
