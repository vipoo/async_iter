import {pump} from '../..'

const delay = period => new Promise(res => setTimeout(res, period))

async function main() {
  const items = await pump((target, hasStopped) => {
    setTimeout(async () => {
      for (let i = 1; i < 200; i++)
        await target.next({y: i})
    }, 100)

    setTimeout(async () => {
      for (let i = 1; i < 200; i++)
        await target.next({x: i})
    }, 100)

    setTimeout(async () => {
      for (let i = 1; i < 200; i++)
        await target.next({z: i})
    }, 100)

    setTimeout(async () => {
      for (let i = 1; !hasStopped.now(); i++) {
        await delay(50)
        if ((await target.next({a: i})).done)
          break
      }
    }, 100)

    setTimeout(() => target.return(), 2000)
  })

  for await (const item of items)
    console.log(item)
}

main()
