import {forEach, concat} from '../../pipeline/browsers'

function* source1() {
  yield 1
  yield 2
  yield 3
}

function* source2() {
  yield 4
  yield 5
  yield 6
}

function* source3() {
  yield 7
  yield 8
  yield 9
}

function main() {
  source1() |> concat(source2()) |> forEach(console.log(?))
  console.log('--------')
  source1() |> concat(source2()) |> concat(source3()) |> forEach(console.log(?))
  console.log('--------')
  source1() |> concat(source2(), source3()) |> forEach(console.log(?))

  console.log('done....')
}

main()
