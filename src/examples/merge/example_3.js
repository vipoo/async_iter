import {merge, first, timeout} from '../../pipeline'

const delay = period => new Promise(res => setTimeout(res, period))

async function* source1() {
  await delay(40)
  yield await 'Yield Value'
  console.log('Iteration was not cancelled, so we do get here')
}

async function main() {
  const item = await (source1() |> merge(timeout(1000)) |> first())

  console.log(item)

  console.log('done....')
}

main()
