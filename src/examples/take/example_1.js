import {take} from '../..'

function main() {
  const items = take([1, 2, 3, 4, 5], 3)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
