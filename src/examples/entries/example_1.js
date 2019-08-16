import {entries} from '../../pipeline/browsers'

function main() {
  const items = ['a', 'b', 'c'] |> entries()

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
