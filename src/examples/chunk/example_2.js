import {forEach, chunk} from '../../pipeline'

/**
 * Example usage of the chunk function
 * @name example_2
 * @memberof module:chunk-examples
 * @function
 */

async function* source() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
  yield await 6
}

async function main() {
  source() |> chunk(2) |> forEach(console.log)

  console.log('done....')
}

main()
