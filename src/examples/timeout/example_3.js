import {timeoutError, forEach, TimeoutCancel} from '../../pipeline'

/**
 * Example usage of the timeout function
 * @name example_3
 * @memberof module:timeout-examples
 * @function
 */

async function main() {

  const tc = new TimeoutCancel()

  const x = (timeoutError(5000, tc)
    |> forEach(console.log))

  setTimeout(() => tc(), 1000)

  await x

  console.log('done....')
}

main().catch(err => console.log(err.message))
