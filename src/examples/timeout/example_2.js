import {timeoutError, forEach} from '../../pipeline'

async function main() {
  await (timeoutError(50)
    |> forEach(console.log))

  console.log('done....')
}

main().catch(err => console.log(err.message))
