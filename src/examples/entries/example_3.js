import {entries} from '../../pipeline/browsers'

async function* source() {
  yield await 'a'
  yield await 'b'
  yield await 'c'
  yield await 'd'
  yield await 'e'
}

async function main() {
  const items = source() |> entries()

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
