import {range, bufferBy} from '../../pipeline/browsers'

/**
 * Example usage of the bufferBy function
 * @name example_1
 * @memberof module:bufferBy-examples
 * @function
 */
async function main() {
  const items = await (
    range({start: 1, end: 20})
    |> bufferBy((item, buffer) => buffer.length === 5, 100))

  for await (const t of items)
    console.log('t', t)

  console.log('done....')
}

export default main()
