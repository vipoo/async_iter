import {every} from '../../pipeline/browsers'

function main() {
  const greaterThan1 = [1, 2, 3, 4, 5] |> every(x => x >= 1)
  const greaterThan4 = [1, 2, 3, 4, 5] |> every(x => x >= 4)

  console.log('every item greater than 1:', greaterThan1)
  console.log('every item greater than 4:', greaterThan4)
  console.log('done....')
}

main()
