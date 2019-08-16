import {last} from '../../pipeline/browsers'

function main() {
  const item = [1, 2, 3, 4, 5] |> last()

  console.log('last ', item)
  console.log('done....')
}

main()
