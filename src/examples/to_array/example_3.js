import {toArray} from '../../pipeline/browsers'

function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

async function main() {
  const items = await (Promise.resolve(source()) |> toArray())

  console.log(items.join(', '))

  console.log('done....')
}

main()
