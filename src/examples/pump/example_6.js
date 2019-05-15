import {pump} from '../..'

async function main() {
  console.log('\n\n')
  const pump1 = await pump(async (target) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    await target.next()
    while (letters.length > 0) {
      const letter = letters.shift()
      if ((await target.next(letter)).done)
        break
    }

    console.log(`pump1 stopped with remaining letters of ${letters}`)
    await target.return()
  })

  const pump2 = await pump(async (target) => {
    console.log('starting consumption of pump1')
    await target.next()

    for await (const item of pump1) {
      const r = (await target.next(item))
      if (r.done)
        break
    }

    console.log('pump2 stopped')
    await target.return()
  })

  console.log('Starting consumption of pump2')
  for await (const item of pump2) {
    console.log('Retrieved Item:', item)
    console.log('Breaking iteration now.')
    break
  }

  setTimeout(() =>
    console.log('\nOnly consumed one item, b, c were lost, rest were not generated'),
  250)
}

main()
