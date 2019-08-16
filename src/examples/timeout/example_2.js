import {timeoutError, forEach} from '../../pipeline/browsers'

async function main() {
  await (timeoutError(50)
    |> forEach(console.log(?)))

  console.log('done....')
}

main().catch(err => console.log(err.message))
