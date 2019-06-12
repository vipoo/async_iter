import {timeout, forEach} from '../../pipeline'

async function main() {
  await (timeout(50, 'Time out value')
    |> forEach(console.log))

  console.log('done....')
}

main()
