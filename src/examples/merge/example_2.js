import {merge, first, timeout} from '../../pipeline'

const delay = period => new Promise(res => setTimeout(res, period))

async function* source1() {
  await delay(1000)
  yield await 1
  console.log('Iteration is aborted and so we do not get here')
}

async function main() {
  const item = await (merge(source1(), timeout(200)) |> first())

  console.log(item)

  console.log('done....')
}

main()
