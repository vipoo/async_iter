import {forEach, mergeMap, map} from '../../pipeline'

/**
 * Example usage of the mergeMap function
 * @name example_2
 * @memberof module:mergeMap-examples
 * @function
 */

const source1 = [1, 2, 3, 4, 5]
const source2 = ['a', 'b', 'c', 'd', 'e']

async function main() {
  await (source2
    |> mergeMap(x => source1 |> map(i => `${i} - ${x}`))
    |> forEach(console.log))

  console.log('done....')
}

main()
