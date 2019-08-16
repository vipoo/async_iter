import {take} from '../../pipeline/browsers'

function main() {
  const items = [1, 2, 3, 4, 5] |> take(0)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
