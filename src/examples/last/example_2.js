import {last} from '../../pipeline'

/**
 * Example usage of the last function
 * @name example_2
 * @memberof module:last-examples
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
  const item = await (source() |> last())

  console.log('last: ', item)
  console.log('done....')
}

main()
