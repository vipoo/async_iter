import {count} from '../../pipeline/browsers'

/**
 * Example usage of the count function
 * @name example_1
 * @memberof module:count-examples
 * @function
 */

function main() {
  const item = [1, 2, 3, 4, 5] |> count()

  console.log('count: ', item)
  console.log('done....')
}

main()
