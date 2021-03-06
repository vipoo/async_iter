import {forEach, bufferGroupBy} from '../../pipeline/browsers'

const delay = period => new Promise(res => setTimeout(res, period))

async function* source() {
  yield {a: 1, b: 'Alpha'}
  yield {a: 2, b: 'Beta'}
  yield {a: 1, b: 'Gamma'}
  yield {a: 2, b: 'Zeta'}
  yield {a: 3, b: 'AAA'}
  await delay(200)
  yield {a: 3, b: 'BBB'}
}

async function main() {
  await (source()
    |> bufferGroupBy(item => item.a, (item, buffer) => buffer.length === 2, 10))
    |> forEach(console.log(?))

  console.log('done....')
}

main()
