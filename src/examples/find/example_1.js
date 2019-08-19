import {find} from '../../pipeline/browsers'

const source = [
  {a: 7, b: 1},
  {a: 8, b: 2},
  {a: 9, b: 3},
]
function main() {
  const item = source |> find(x => x.a === 8)

  console.log('found: ', item)
  console.log('done....')
}

main()
