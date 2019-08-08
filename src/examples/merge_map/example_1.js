import {forEach, mergeMap, map} from '../../pipeline/browsers'

/**
 * Example usage of the mergeMap function
 * @name example_1
 * @memberof module:mergeMap-examples
 * @function
 */

async function* source1() {
  yield await Promise.resolve(1)
  yield await Promise.resolve(2)
  yield await Promise.resolve(3)
  yield await Promise.resolve(4)
  yield await Promise.resolve(5)
}

async function* source2() {
  yield await Promise.resolve('a')
  yield await Promise.resolve('b')
  yield await Promise.resolve('c')
  yield await Promise.resolve('d')
  yield await Promise.resolve('e')
}

async function main() {
  await (source2()
    |> mergeMap(x => source1() |> map(i => `${i} - ${x}`))
    |> forEach(console.log))

  console.log('done....')
}

main()
