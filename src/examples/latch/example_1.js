import {pump} from '../..'

async function main() {
  const items = await pump(async (target, hasStopped) => {
    hasStopped.then(() => console.log('Received has stopped signal'))
    console.log('starting pushing values.')
    await target.next(1)
    await target.next(2)
    await target.next(3)
    await target.return()
    console.log('all values pushed.')
  })

  console.log('starting consumption of values.')
  for await (const item of items)
    console.log(item)
  console.log('consumed all values.')
}

main()
