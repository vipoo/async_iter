import {byLines} from '../..'

function main() {
  const items = byLines(['abc\n', 'def', 'ghi\n', '', '\n', '\n', 'jkl\nnmo', '\n', ''])

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
