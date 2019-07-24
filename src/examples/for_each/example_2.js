import {forEach} from '../../pipeline'

/**
 * Example usage of the forEach function
 * @name example_2
 * @memberof module:forEach-examples
 * @function
 */

async function* source() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
}

async function main() {
  await (source() |> forEach(x => console.log(x)))

  console.log('done....')
}

main()
