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
  setTimeout(() => emitter.emit('data', 'Sample1\n'), 100)
  setTimeout(() => emitter.emit('data', 'Sample2\n'), 200)
  setTimeout(() => emitter.emit('data', 'Sample3\n'), 300)
  setTimeout(() => emitter.emit('close'), 500)
}

async function main() {

  sourceGenerator()

  await (fromStream(emitter)
    |> map(x => x.toString())
    |> forEach(x => console.log(x.slice(0, x.length - 1))))

  console.log('done....')
}

main()
