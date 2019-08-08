import {rateLimit} from '../../pipeline/browsers'

/**
 * Example usage of the rateLimit function
 * @name example_1
 * @memberof module:rateLimit-examples
 * @function
 */

async function main() {
  let startTime = new Date().getTime()
  const items = ['first', 'second', 'third', 'fourth', 'fifth']
    |> rateLimit(5, 200, v => v.toString().length)

  for await (const t of items) {
    const now = new Date().getTime()
    const diff = (now - startTime) / 1000
    startTime = now
    console.log(`outgoing: ${t} \tafter: ${Math.round(diff * 10, 2) / 10}s`)
  }

  console.log('done.')
}

main()
