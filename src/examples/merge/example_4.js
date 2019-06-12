import {merge} from '../../pipeline'

async function* source1() {
  yield await Promise.resolve(1)
  yield await Promise.resolve(2)
  yield await Promise.resolve(3)
  yield await Promise.resolve(4)
  yield await Promise.resolve(5)
}

async function* source2() {
  yield await Promise.resolve('a')
  yield await Promise.resolve('b')
  yield await Promise.resolve('c')
  yield await Promise.resolve('d')
  yield await Promise.resolve('e')
}

async function main() {
  const items = await (source1() |> merge(source2()))

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
