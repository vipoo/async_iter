import {byLines} from '../../pipeline'

function main() {
  const items = ['abc\n', 'def', 'ghi\n', '', '\n', '\n', 'jkl\nnmo', '\n', ''] |> byLines()

  for (const item of items)
    console.log(item)

  console.log('done....')
}

main()
