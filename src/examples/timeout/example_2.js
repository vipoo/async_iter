import {timeout, forEach} from '../../pipeline'

async function main() {
  await (timeout(50, new Error('Timeout exception'))
    |> forEach(console.log))

  console.log('done....')
}

main().catch(err => console.log(err.message))
