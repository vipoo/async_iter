import {take} from '../../take'

async function main() {
  const items = take([1, 2, 3, 4, 5], 3)

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
