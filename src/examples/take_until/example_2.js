import {takeUntil} from '../..'

function main() {
  const items = takeUntil([1, 2, 3, 4, 5], x => x === 3)

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
