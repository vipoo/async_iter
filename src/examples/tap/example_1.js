import {tap} from '../../pipeline/browsers'

function main() {
  const items = [1, 2, 3, 4, 5] |> tap(x => console.log(`tap: ${x}`))

  for (const _ of items) // eslint-disable-line no-unused-vars
    console.log('!')

  console.log('done....')
}

main()
