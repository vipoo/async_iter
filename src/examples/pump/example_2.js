import {pump} from '../../pipeline/browsers'

async function main() {
  await pump(async target => {
    console.log('never get here, as no consumer is started')
    await target.next()
    await target.next(1)
    await target.next(2)
    await target.next(3)
  })

  console.log('if items are not consumed, nothing really happens')
}

main()
