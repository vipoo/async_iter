import {forEach, take, fromStream, map} from '../../pipeline'
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
    |> take(10)
    |> map(x => x.toString())
    |> forEach(x => process.stdout.write(x)))

  p.kill()
  console.log('done....')
}

main()
