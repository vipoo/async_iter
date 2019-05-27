import {pump} from '../../pipeline'

const delay = period => new Promise(res => setTimeout(res, period))
const forTicks = () => new Promise(res => process.nextTick(res))

async function main() {
  const items = await pump(async (target, hasStopped) => {
    await target.next()
    process.nextTick(async () => {
      for (let i = 1; i < 200; i++) {
        await forTicks()
        await target.next({y: i})
      }
    })

    process.nextTick(async () => {
      for (let i = 1; i < 200; i++) {
        await forTicks()
        await target.next({x: i})
      }
    })

    process.nextTick(async () => {
      for (let i = 1; i < 200; i++) {
        await forTicks()
        await target.next({z: i})
      }
    })

    process.nextTick(async () => {
      for (let i = 1; !hasStopped.now(); i++) {
        await delay(50)
        if ((await target.next({a: i})).done)
          break
      }
    })

    setTimeout(() => target.return(), 200)
  })

  for await (const item of items)
    console.log(item)
}

main()
