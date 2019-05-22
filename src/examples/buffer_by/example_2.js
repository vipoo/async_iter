import {range, bufferBy} from '../..'

async function myForEach(source) {
  for await (const item of source)
    console.log(item)
}

async function main() {
  await (
    range({start: 1, end: 20})
    |> bufferBy(?, (item, buffer) => buffer.length === 5, 1000)
    |> myForEach(?, console.log))

  console.log('done....')
}

main()
