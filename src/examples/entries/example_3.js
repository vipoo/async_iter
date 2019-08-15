import {entries} from '../../pipeline/browsers'

/**
 * Example usage of the entries function
 * @name example_3
 * @memberof module:entries-examples
 * @function
 */

async function* source() {
  yield await 'a'
  yield await 'b'
  yield await 'c'
  yield await 'd'
  yield await 'e'
}

async function main() {
  const items = source() |> entries()

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
