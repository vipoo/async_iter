import {spawn, map, take} from '../../pipeline'

async function main() {
  const items = await spawn('node', ['./src/examples/spawn/logger.js'])
    |> map(x => x.stdout ? ({stdout: x.stdout.toString()}) : ({stderr: x.stderr.toString()}))
    |> take(20)

  for await (const item of items)
    if (item.stdout)
      console.log(item.stdout)
    else
      console.log(item.stderr)

  console.log('done....')
}

main()
