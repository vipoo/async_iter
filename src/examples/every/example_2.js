import {every} from '../../pipeline/browsers'

async function* source() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
}

async function main() {
  const greaterThan1 = source() |> every(x => x >= 1)
  const greaterThan4 = source() |> every(x => x >= 4)

  console.log('every item greater than 1:', await greaterThan1)
  console.log('every item greater than 4:', await greaterThan4)
  console.log('done....')
}

main()
