import {map} from '../../pipeline'

/**
 * Example usage of the map function
 * @name example_1
 * @memberof module:map-examples
 * @function
 */

function main() {
  const items = [1, 2, 3, 4, 5] |> map(x => x * 2)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
