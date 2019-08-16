import {tap} from '../../pipeline/browsers'

async function* source() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
}

async function main() {
  const items = source() |> tap(x => console.log(`tap: ${x}`))

  for await (const _ of items) // eslint-disable-line no-unused-vars
    console.log('!')

  console.log('done....')
}

main()
