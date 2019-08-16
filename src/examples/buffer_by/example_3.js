import {bufferBy, forEach} from '../../pipeline/browsers'

async function* source() {
  yield await Promise.resolve(1)
  yield await Promise.resolve(2)
  yield await Promise.resolve(3)
  yield await Promise.resolve(4)
  yield await Promise.resolve(5)
  yield await Promise.resolve(6)
}

async function main() {
  await (
    Promise.resolve(source())
    |> bufferBy((item, buffer) => buffer.length === 5, 100)
    |> forEach(console.log))

  console.log('done....')
}

export default main()
