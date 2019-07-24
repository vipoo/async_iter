import {takeUntil} from '../../pipeline'

/**
 * Example usage of the takeUntil function
 * @name example_2
 * @memberof module:takeUntil-examples
 * @function
 */

function main() {
  const items = [1, 2, 3, 4, 5] |> takeUntil(x => x === 3)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
