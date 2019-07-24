import {delayUntil, forEach} from '../../pipeline'

/**
 * Example usage of the delayUntil function
 * @name example_1
 * @memberof module:delayUntil-examples
 * @function
 */

async function main() {
  const then = Date.now() + 50
  await ([1, 2, 3, 4, 5]
    |> delayUntil(then)
    |> forEach(console.log))

  console.log('done....')
}

main()
