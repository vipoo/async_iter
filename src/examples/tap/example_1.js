import {tap} from '../..'

function main() {
  const items = tap([1, 2, 3, 4, 5], x => process.stdout.write(`tap: ${x}`))

  for (const _ of items) // eslint-disable-line no-unused-vars
    console.log('!')

  console.log('done....')
}

main()
