import {pump} from '../../pipeline/browsers'

async function main() {
  const items = await pump(async target => {
    await target.next()
    await target.next(1)
    await target.next(2)
    await target.throw(new Error('This is an error'))
  })

  try {
    for await (const item of items)
      console.log(item)
  } catch (e) {
    console.log(e.message)
  }

}

export default main()
