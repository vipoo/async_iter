import {filter} from '../../pipeline/browsers'

function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

function main() {
  const items = source() |> filter(x => x % 2 === 0)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
