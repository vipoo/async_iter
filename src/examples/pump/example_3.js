import {pump} from '../../pipeline/browsers'

const delay = period => new Promise(res => setTimeout(res, period))

/**
 * Example usage of the pump function
 * @name example_3
 * @memberof module:pump-examples
 * @function
 */
async function main() {
  const items = await pump(async (target, hasStopped) => {
    await target.next()
    process.nextTick(async () => {
      for (let i = 1; i < 200; i++)
        await target.next({y: i})
    })

    process.nextTick(async () => {
      for (let i = 1; i < 200; i++)
        await target.next({x: i})
    })

    process.nextTick(async () => {
      for (let i = 1; i < 200; i++)
        await target.next({z: i})
    })

    let counter = 1
    process.nextTick(async () => {
      while (!hasStopped.now()) {
        await delay(50)
        if ((await target.next({a: counter++})).done)
          break
      }
    })

    const h = setInterval(() => {
      if (counter !== 4)
        return

      target.return()
      clearInterval(h)
    }, 1)
  })

  for await (const item of items)
    console.log(item)

  console.log('done')
}

export default main()
