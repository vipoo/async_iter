import {timeout, forEach} from '../../pipeline'

/**
 * Example usage of the timeout function
 * @name example_1
 * @memberof module:timeout-examples
 * @function
 */

async function main() {
  await (timeout(50)
    |> forEach(console.log))

  console.log('done....')
}

main()
