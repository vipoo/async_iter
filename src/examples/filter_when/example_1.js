import {forEach, filterWhen} from '../../pipeline/browsers'

function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  yield 6
}

function main() {
  source()
    |> filterWhen(i => i < 2 || i >= 5, (a, b) => `skipped: ${a} to ${b}`)
    |> forEach(console.log)

  console.log('done....')
}

main()
