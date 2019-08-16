import {range, forEach} from '../../pipeline/browsers'

function main() {
  range({start: 1, end: 20})
    |> forEach((x, i) => console.log(x, i))

  console.log('done....')
}

main()
