import {takeWhile} from '../../pipeline/browsers'

/**
 * Example usage of the takeWhile function
 * @name example_1
 * @memberof module:takeWhile-examples
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
  const items = source() |> takeWhile(x => x <= 3)

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
