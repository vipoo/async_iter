import {take} from '../../pipeline'

/**
 * Example usage of the take function
 * @name example_2
 * @memberof module:take-examples
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
  const items = source() |> take(3)

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
