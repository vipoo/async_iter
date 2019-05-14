import {map} from '../..'

function main() {
  const items = map([1, 2, 3, 4, 5], x => x * 2)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
