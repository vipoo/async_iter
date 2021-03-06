import {count} from '../../pipeline/browsers'

async function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

async function main() {
  const item = await (source() |> count())

  console.log('count: ', item)
  console.log('done....')
}

main()
