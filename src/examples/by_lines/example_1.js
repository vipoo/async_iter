import {byLines} from '../../pipeline/browsers'

/**
 * Example usage of the byLines function
 * @name example_1
 * @memberof module:byLines-examples
 * @function
 */

function main() {
  const items = ['abc\n', 'def', 'ghi\n', '', '\n', '\n', 'jkl\nnmo', '\n', ''] |> byLines()

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
