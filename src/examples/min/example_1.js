import {min} from '../../pipeline/browsers'

function example1() {
  const item = [5, 4, 1, 2, 3] |> min()

  console.log('example 1 min: ', item)
}

function example2() {
  const item = ['g', 'f', 'r', 'a', 'b', 'i'] |> min()

  console.log('example 2 min: ', item)
}

function example3() {
  const item = [{a: 5}, {a: 4}, {a: 1}, {a: 2}, {a: 3}, {a: 1}] |> min(x => x.a)

  console.log('example 3 min: ', item)
}

function example4() {
  const item = [{a: 5}, {a: 4}, {a: 1}, {a: 2}, {a: 3}] |> min((x, y) => x.a < y.a ? -1 : 1)

  console.log('example 4 min: ', item)
}

function main() {
  example1()
  example2()
  example3()
  example4()
}

main()
