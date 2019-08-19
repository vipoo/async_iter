import {find} from '../../pipeline/browsers'

async function* source() {
  yield await {a: 7, b: 1}
  yield await {a: 8, b: 2}
  yield await {a: 9, b: 3}
}

async function main() {
  const item = await (source() |> find(x => x.a === '??'))

  console.log('found: ', item)
  console.log('done....')
}

main()
