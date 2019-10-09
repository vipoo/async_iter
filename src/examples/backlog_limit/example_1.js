import {backlogLimit, forEach} from '../../pipeline/browsers'

const delay = period => new Promise(res => setTimeout(res, period))

async function* source() {
  await delay(100)
  console.log('Started yielding')
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
  yield await 6
  yield await 7
  yield await 8
  console.log('first 8 yielded')
  await delay(100)
  yield await 9
}

async function main() {

  source()
    |> backlogLimit(3)
    |> forEach(async (d, i) => {
      await delay(5)
      console.log(d, i)
    })

  console.log('done....')
}

export default main()
