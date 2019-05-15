import {range, bufferBy} from '../..'

async function main() {
  const items = await (
    range({start: 1, end: 20})
    |> bufferBy(?, (item, buffer) => buffer.length === 5, 1000))

  for await (const t of items)
    console.log('t', t)

  console.log('done....')
}

main()
