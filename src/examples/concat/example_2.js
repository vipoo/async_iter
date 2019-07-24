import {forEach, concat} from '../../pipeline'

/**
 * Example usage of the concat function
 * @name example_2
 * @memberof module:concat-examples
 * @function
 */

async function* source1() {
  yield await 1
  yield await 2
  yield await 3
}

async function* source2() {
  yield await 4
  yield await 5
  yield await 6
}

async function* source3() {
  yield await 7
  yield await 8
  yield await 9
}

async function main() {
  await (source1() |> concat(source2()) |> forEach(console.log))
  console.log('--------')
  await (source1() |> concat(source2()) |> concat(source3()) |> forEach(console.log))
  console.log('--------')
  await (source1() |> concat(source2(), source3()) |> forEach(console.log))

  console.log('done....')
}

main()
