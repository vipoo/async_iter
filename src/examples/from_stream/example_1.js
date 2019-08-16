import {forEach, take, fromStream, map, byLines} from '../../pipeline'
import childProcess from 'child_process'

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
