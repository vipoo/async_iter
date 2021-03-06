import {forEach, filter} from '../../pipeline/browsers'

async function* source() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
  yield await 6
}

async function main() {
  await (source()
    |> filter(async i => await i < 2 || i >= 5, async (a, b) => await `skipped: ${a} to ${b}`)
    |> forEach(console.log(?)))

  console.log('done....')
}

main()
