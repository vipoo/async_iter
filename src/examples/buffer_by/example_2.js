import {range, bufferBy, forEach} from '../../pipeline/browsers'

async function main() {
  await (
    range({start: 1, end: 20})
    |> bufferBy((item, buffer) => buffer.length === 5, 100)
    |> forEach(a => console.log(a)))

  console.log('done....')
}

export default main()
