import {min} from '../../pipeline/browsers'

async function* async(array) {
  for (const item of array)
    yield await item
}

async function example1() {
  const item = await ([5, 4, 1, 2, 3] |> async |> min())

  console.log('example 1 min: ', item)
}

async function example2() {
  const item = await (['g', 'f', 'r', 'a', 'b', 'i'] |> async  |> min())

  console.log('example 2 min: ', item)
}

async function example3() {
  const item = await ([{a: 5}, {a: 4}, {a: 1}, {a: 2}, {a: 3}, {a: 1}]  |> async |> min(x => x.a))

  console.log('example 3 min: ', item)
}

async function example4() {
  const item = await ([{a: 5}, {a: 4}, {a: 1}, {a: 2}, {a: 3}]  |> async |> min((x, y) => x.a < y.a ? -1 : 1))

  console.log('example 4 min: ', item)
}

async function main() {
  await example1()
  await example2()
  await example3()
  await example4()
}

main()
