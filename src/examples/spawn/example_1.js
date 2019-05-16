import {spawn, map, take} from '../..'

async function main() {
  const items = await spawn('node', ['./src/examples/spawn/logger.js'])
    |> map(?, x => x.stdout ? ({stdout: x.stdout.toString()}) : ({stderr: x.stderr.toString()}))
    |> take(?, 20)

  for await (const item of items)
    if (item.stdout)
      process.stdout.write(item.stdout)
    else
      process.stderr.write(item.stderr)

  console.log('done....')
}

main()
