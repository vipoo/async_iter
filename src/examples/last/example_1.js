import {last} from '../../pipeline'

/**
 * Example usage of the last function
 * @name example_1
 * @memberof module:last-examples
 * @function
 */

function main() {
  const item = [1, 2, 3, 4, 5] |> last()

  console.log('last ', item)
  console.log('done....')
}

main()
