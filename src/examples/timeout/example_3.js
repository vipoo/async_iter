import {timeoutError, forEach, TimeoutCancel} from '../../pipeline'

async function main() {

  const tc = new TimeoutCancel()

  const x = (timeoutError(5000, tc)
    |> forEach(console.log))

  setTimeout(() => tc(), 1000)

  await x

  console.log('done....')
}

main().catch(err => console.log(err.message))
