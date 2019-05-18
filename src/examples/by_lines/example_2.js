import {byLines} from '../..'

async function* source() {
  yield await 'abc\n'
  yield await 'def'
  yield await 'ghi\n'
  yield await ''
  yield await '\n'
  yield await '\n'
  yield await 'jkl\nnmo'
  yield await '\n'
  yield await ''
}

async function main() {
  const items = await byLines(source())

  for await (const item of items)
    console.log(item)

  console.log('done....')
}

main()
