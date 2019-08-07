import {forEach, chunk} from '../../pipeline/browsers'

/**
 * Example usage of the chunk function
 * @name example_1
 * @memberof module:chunk-examples
 * @function
 */

function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  yield 6
}

function main() {
  source() |> chunk(2) |> forEach(console.log)

  console.log('done....')
}

main()
