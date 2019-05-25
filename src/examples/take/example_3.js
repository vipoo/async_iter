import {take} from '../..'

function main() {
  const items = take([1, 2, 3, 4, 5], 0)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
