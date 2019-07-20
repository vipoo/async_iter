import {forEach, fromStream, map} from '../../pipeline'
import EventEmitter from 'events'

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
    |> forEach(x => process.stdout.write(x)))

  console.log('done....')
}

main()
