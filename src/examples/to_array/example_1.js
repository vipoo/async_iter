import {toArray} from '../..'

function* source() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
}

function main() {
  const items = toArray(source())

  console.log(items.join(', '))

  console.log('done....')
}

main()
