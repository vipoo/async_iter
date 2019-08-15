import {entries} from '../../pipeline/browsers'

/**
 * Example usage of the entries function
 * @name example_1
 * @memberof module:entries-examples
 * @function
 */

function main() {
  const items = ['a', 'b', 'c'] |> entries()

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
