import {delay, forEach} from '../../pipeline/browsers'

/**
 * Example usage of the delay function
 * @name example_1
 * @memberof module:delay-examples
 * @function
 */

async function main() {
  await ([1, 2, 3, 4, 5]
    |> delay(50)
    |> forEach(console.log))

  console.log('done....')
}

main()
