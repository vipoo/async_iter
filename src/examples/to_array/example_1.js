import {toArray} from '../../pipeline'

/**
 * Example usage of the toArray function
 * @name example_1
 * @memberof module:toArray-examples
 * @function
 */

function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

function main() {
  const items = source() |> toArray()

  console.log(items.join(', '))

  console.log('done....')
}

main()
