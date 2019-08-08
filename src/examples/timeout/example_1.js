import {timeout, forEach} from '../../pipeline/browsers'

/**
 * Example usage of the timeout function
 * @name example_1
 * @memberof module:timeout-examples
 * @function
 */

async function main() {
  await (timeout(50)
    |> forEach(s => console.log(s.description)))

  console.log('done....')
}

main()
