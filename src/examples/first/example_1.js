import {first} from '../../pipeline/browsers'

/**
 * Example usage of the first function
 * @name example_1
 * @memberof module:first-examples
 * @function
 */

function main() {
  const item = [1, 2, 3, 4, 5] |> first()

  console.log('first: ', item)
  console.log('done....')
}

main()
