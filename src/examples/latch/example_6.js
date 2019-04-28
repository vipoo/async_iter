import {pump} from '../..'

async function main() {
  const pump1 = await pump(async (target, hasStopped) => {
    const letters = ['a', 'b', 'c', 'd']

    while (letters.length > 0) {
      const letter = letters.shift()

      console.log('pump1:', letter)
      if ((await target.next(letter)).done)
        break
    }

    console.log('pump1: return')
    await target.return()
  })

  const pump2 = await pump(async (target, hasStopped) => {
    console.log('starting consumption of pump1')
    for await (const item of pump1) {
      console.log('pump2:', item)
      if ((await target.next(item)).done) break
    }

    console.log('pump2: return')
    await target.return()
  })

  console.log('Starting consumption of pump2')
  for await (const item of pump2) {
    console.log('Retrieved Item:', item)
    console.log('Breaking iteration now.')
    break
  }

  console.log('Only consumed one item, rest where thrown away')
}

main()
