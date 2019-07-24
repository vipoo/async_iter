import {byLines} from '../../pipeline'

async function* source() {
  yield await 'abc\n'
  yield await 'def'
  yield await 'ghi\n'
  yield await ''
  yield await '\n'
  yield await '\n'
  yield await 'jkl\nnmo'
  yield await '\n'
  yield await ''
}

/**
 * Example usage of the byLines function
 * @name example_2
 * @memberof module:byLines-examples
 * @function
 */

async function main() {
  const items = await (source() |> byLines())

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
