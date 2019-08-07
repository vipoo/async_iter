import {range, bufferBy, forEach} from '../../pipeline/browsers'

/**
 * Example usage of the bufferBy function
 * @name example_2
 * @memberof module:bufferBy-examples
 * @function
 */
async function main() {
  await (
    range({start: 1, end: 20})
    |> bufferBy((item, buffer) => buffer.length === 5, 100)
    |> forEach(console.log))

  console.log('done....')
}

export default main()
