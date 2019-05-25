import {delayUntil, forEach} from '../..'

async function main() {
  const then = Date.now() + 50
  await ([1, 2, 3, 4, 5]
    |> delayUntil(?, then)
    |> forEach(?, console.log))

  console.log('done....')
}

main()
