import {merge, first, timeout, TimeoutCancel} from '../../pipeline/browsers'

const delay = period => new Promise(res => setTimeout(res, period))

/**
 * Example usage of the merge function
 * @name example_3
 * @memberof module:merge-examples
 * @function
 */

async function* source1() {
  await delay(40)
  yield await 'Yield Value'
  console.log('Iteration was not cancelled, so we do get here')
}

async function main() {
  const tc = new TimeoutCancel()
  const item = await (source1() |> merge(timeout(100000, tc)) |> first())
  tc()

  console.log(item)

  console.log('done....')
}

main()
