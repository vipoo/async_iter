import {entries} from '../../pipeline/browsers'

/**
 * Example usage of the entries function
 * @name example_2
 * @memberof module:entries-examples
 * @function
 */

function* source() {
  yield 'a'
  yield 'b'
  yield 'c'
  yield 'd'
  yield 'e'
}

function main() {
  const items = source() |> entries()

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
