import {merge, first, timeout, TimeoutCancel, pump} from '../../pipeline'

/**
 * Example usage of the merge function
 * @name example_5
 * @memberof module:merge-examples
 * @function
 */

const delay = period => new Promise(res => setTimeout(res, period))

function source1(tc) {
  return pump(async (target, hasStopped) => {
    Promise.race([hasStopped, tc]).then(() => { target.return(); console.log('has stopped!') })
    await target.next()

    await delay(40)

    await target.next('Yield Value')
  })
}

async function main() {
  const tc = new TimeoutCancel()
  const item = await (source1(tc) |> merge(timeout(5000, tc)) |> first())
  tc()

  console.log(item)

  console.log('done....')
}

main()
