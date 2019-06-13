import {timeout, forEach} from '../../pipeline'

async function main() {

  let cancel = undefined

  const x = (timeout(5000, new Error('Timeout exception'), c => cancel = c)
    |> forEach(console.log))

  setTimeout(() => cancel(), 1000)

  await x

  console.log('done....')
}

main().catch(err => console.log(err.message))
