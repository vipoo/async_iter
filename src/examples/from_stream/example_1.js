import {forEach, take, fromStream, map} from '../..'
import childProcess from 'child_process'

async function main() {
  const p = childProcess.spawn('node', ['./src/examples/spawn/logger.js'])

  await (fromStream(p.stdout)
    |> take(?, 10)
    |> map(?, x => x.toString())
    |> forEach(?, x => process.stdout.write(x)))

  p.kill()
  console.log('done....')
}

main()
