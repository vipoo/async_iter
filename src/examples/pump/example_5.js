import {pump} from '../../pipeline/browsers'

const delay = period => new Promise(res => setTimeout(res, period))

const letters = ['a', 'b', 'c', 'd']

async function getNextValue() {
  await delay(100) // simulate effort to get value

  return letters.length === 0 ? undefined : letters.shift()
}

const True = true

async function main() {
  const items = await pump(async (target, hasStopped) => {
    await target.next()
    while (True) {
      const letter = await Promise.race([getNextValue(), hasStopped])
      if (!letter)
        break

      console.log('pushing ', letter)
      if ((await target.next(letter)).done)
        break
    }

    console.log('return')
    await target.return()
  })

  for await (const item of items) {
    console.log(item)
    await delay(50) //simulate effort to save value
    break
  }
  console.log('Only consumed one item, rest were not generated')
}

main()
