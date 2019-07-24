import {max} from '../../pipeline'

/**
 * Example usage of the max function
 * @name example_1
 * @memberof module:max-examples
 * @function
 */

function example1() {
  const item = [2, 5, 4, 1, 2, 3] |> max()

  console.log('example 1 max: ', item)
}

function example2() {
  const item = ['g', 'f', 'r', 'a', 'b', 'i'] |> max()

  console.log('example 2 max: ', item)
}

function example3() {
  const item = [{a: 3}, {a: 5}, {a: 4}, {a: 1}, {a: 2}, {a: 1}] |> max(x => x.a)

  console.log('example 3 max: ', item)
}

function example4() {
  const item = [{a: 3}, {a: 5}, {a: 4}, {a: 1}, {a: 2}] |> max((x, y) => x.a < y.a ? -1 : 1)

  console.log('example 4 max: ', item)
}

function main() {
  example1()
  example2()
  example3()
  example4()
}

main()
