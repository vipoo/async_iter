import {pump} from '../../pipeline'

async function main() {
  const items = pump((target, hasStopped) => undefined)

  console.log('attempt to iterator over non async pump, errors')

  try {
    for await (const item of items)
      console.log(item)
  } catch (err) {
    console.log(err.message)
  }

  console.log('consumed all values.')

}

main()
