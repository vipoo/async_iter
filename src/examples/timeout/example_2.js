import {timeoutError, forEach} from '../../pipeline'

/**
 * Example usage of the timeout function
 * @name example_2
 * @memberof module:timeout-examples
 * @function
 */

async function main() {
  await (timeoutError(50)
    |> forEach(console.log))

  console.log('done....')
}

main().catch(err => console.log(err.message))
