import {forEach, filter} from '../../pipeline/browsers'

function* source() {
  yield {a: 1, b: 1}
  yield {a: 1, b: 2}
  yield {a: 2, b: 3}
  yield {a: 2, b: 4}
  yield {a: 1, b: 5}
  yield {a: 1, b: 6}
  yield {a: 2, b: 7}
  yield {a: 2, b: 8}
}

function main() {
  source()
    |> filter(i => i.a === 2, (a, b) => `skipped: ${a.b} to ${b.b}`)
    |> forEach(console.log(?))

  console.log('done....')
}

main()
