import {max} from '../../pipeline'

async function* async(array) {
  for (const item of array)
    yield await item
}

async function example1() {
  const item = await ([2, 5, 4, 1, 2, 3] |> async |> max())

  console.log('example 1 max: ', item)
}

async function example2() {
  const item = await (['g', 'f', 'r', 'a', 'b', 'i'] |> async |> max())

  console.log('example 2 max: ', item)
}

async function example3() {
  const item = await ([{a: 3}, {a: 5}, {a: 4}, {a: 1}, {a: 2}, {a: 1}] |> async |> max(x => x.a))

  console.log('example 3 max: ', item)
}

async function example4() {
  const item = await ([{a: 3}, {a: 5}, {a: 4}, {a: 1}, {a: 2}] |> async |> max((x, y) => x.a < y.a ? -1 : 1))

  console.log('example 4 max: ', item)
}

async function main() {
  await example1()
  await example2()
  await example3()
  await example4()
}

main()
