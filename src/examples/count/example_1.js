import {count} from '../../pipeline/browsers'

function main() {
  const item = [1, 2, 3, 4, 5] |> count()

  console.log('count: ', item)
  console.log('done....')
}

main()
