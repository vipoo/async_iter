import {forEach, take, fromStream, map, byLines} from '../../pipeline'
import childProcess from 'child_process'

/**
 * Example usage of the fromStream function
 * @name example_1
 * @memberof module:forStream-examples
 * @function
 */

async function main() {
  const p = childProcess.spawn('node', ['./src/examples/spawn/logger.js'])

  await (fromStream(p.stdout)
    |> map(x => x.toString())
    |> byLines()
    |> take(10)
    |> forEach(x => console.log(x)))

  p.kill()
  console.log('done....')
}

main()
