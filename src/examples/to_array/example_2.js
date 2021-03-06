import {toArray} from '../../pipeline/browsers'

async function* source() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
}

async function main() {
  const items = await (source() |> toArray())

  console.log(items.join(', '))

  console.log('done....')
}

main()
