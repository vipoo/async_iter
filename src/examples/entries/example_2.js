import {entries} from '../../pipeline/browsers'

function* source() {
  yield 'a'
  yield 'b'
  yield 'c'
  yield 'd'
  yield 'e'
}

function main() {
  const items = source() |> entries()

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
