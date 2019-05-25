import {delay, forEach} from '../..'

async function main() {
  await ([1, 2, 3, 4, 5]
    |> delay(?, 50)
    |> forEach(?, console.log))

  console.log('done....')
}

main()
