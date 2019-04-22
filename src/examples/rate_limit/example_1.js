import {rateLimit} from '../..'

async function main() {
  let startTime = new Date().getTime()
  const items = ['first', 'second', 'third', 'fourth', 'fifth']
    |> rateLimit(?, 5, 2000, v => v.toString().length)

  for await (const t of items) {
    const now = new Date().getTime()
    const diff = (now - startTime) / 1000
    startTime = now
    console.log(`outgoing: ${t} \tafter: ${diff}s`)
  }

  console.log('done.')
}

main()
