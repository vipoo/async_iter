import {timeout, forEach} from '../../pipeline'

async function main() {
  await (timeout(50)
    |> forEach(console.log))

  console.log('done....')
}

main()
