import {merge, first, timeout} from '../../pipeline/browsers'

const delay = period => new Promise(res => setTimeout(res, period))

async function* source1() {
  await delay(1000)
  yield await 1
  console.log('Iteration is aborted and so we do not get here')
}

async function main() {
  const item = await (source1() |> merge(timeout(200)) |> first())

  console.log(item.description)

  console.log('done....')
}

main()
