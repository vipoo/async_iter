import {merge} from '../..'

async function* source1() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
}

async function* source2() {
  yield await 'a'
  yield await 'b'
  yield await 'c'
  yield await 'd'
  yield await 'e'
}

async function main() {
  const items = await merge(source1(), source2())

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
