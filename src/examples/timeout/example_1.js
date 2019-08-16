import {timeout, forEach} from '../../pipeline/browsers'

async function main() {
  await (timeout(50)
    |> forEach(s => console.log(s.description)))

  console.log('done....')
}

main()
