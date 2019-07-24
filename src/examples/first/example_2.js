import {first} from '../../pipeline'

/**
 * Example usage of the fiirst function
 * @name example_2
 * @memberof module:first-examples
 * @function
 */

async function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

async function main() {
  const item = await (source() |> first())

  console.log('first: ', item)
  console.log('done....')
}

main()
