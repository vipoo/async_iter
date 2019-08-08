import {forEach, fromStream, map} from '../../pipeline'
import EventEmitter from 'events'

/**
 * Example usage of the fromStream function
 * @name example_2
 * @memberof module:forStream-examples
 * @function
 */

const emitter = new EventEmitter()

async function sourceGenerator() {
  setTimeout(() => emitter.emit('data', 'Sample1'), 100)
  setTimeout(() => emitter.emit('data', 'Sample2'), 200)
  setTimeout(() => emitter.emit('data', 'Sample3'), 300)
  setTimeout(() => emitter.emit('close'), 500)
}

async function main() {

  sourceGenerator()

  await (fromStream(emitter)
    |> map(x => x.toString())
    |> forEach(x => console.log(x)))

  console.log('done....')
}

main()
