import {persisted} from '../../pipeline'
import rmfr from 'rmfr'

/**
 * Example usage of the persisted function
 * @name example_1
 * @memberof module:persisted-examples
 * @function
 */

async function* source() {
  yield await '11'
  yield await '22'
  yield await '33'
  yield await '44'
}

async function main() {
  const items = await (source() |> persisted('./tmp/buffering_example'))

  for await (const item of items) {
    console.log(item.value.toString())
    item.completed()
  }

  console.log('done....')
}

rmfr('./tmp').then(() => main())
