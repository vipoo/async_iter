import {first} from '../../pipeline'

/**
 * Example usage of the fiirst function
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
