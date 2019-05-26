import {range, forEach} from '../../pipeline'

function main() {
  range({start: 1, end: 20})
    |> forEach(x => console.log(x))

  console.log('done....')
}

main()
