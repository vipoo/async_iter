import {forEach, combineWhen} from '../../pipeline'

/**
 * Example usage of the combineWhen function
 * @name example_2
 * @memberof module:combineWhen-examples
 * @function
 */

async function* source() {
  yield await '  this is not part of anything'
  yield await '2019-05-26T08:26:14.384548+0000 blah blah'
  yield await '  this is part of above'
  yield await '  this is also part of above'
  yield await '2019-05-27T08:26:14.384548+0000 a new record'
  yield await '  this is part of above'
  yield await '  this is also part of above'
}

const pattern = /\d*-\d*-\d*T\d*:\d*:\d*\.\d*\+\d*\s/
async function main() {
  await (source()
    |> combineWhen(item => pattern.test(item), (i, c) => `${c}\n${i}`)
    |> forEach(console.log))

  console.log('done....')
}

main()
