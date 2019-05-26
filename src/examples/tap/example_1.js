import {tap} from '../../pipeline'

function main() {
  const items = [1, 2, 3, 4, 5] |> tap(x => process.stdout.write(`tap: ${x}`))

  for (const _ of items) // eslint-disable-line no-unused-vars
    console.log('!')

  console.log('done....')
}

main()
