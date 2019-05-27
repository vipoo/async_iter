import 'source-map-support/register'
import {range, broadcast, map} from '../../pipeline'

async function main() {

  const items = range({start: 1, end: 10})
    |> map(x => {
      if (x === 6)
        throw new Error('blah')
      return x
    })
    |> broadcast()

  process.nextTick(async () => {
    try {
      for await (const item of items())
        console.log('consumer A:', item)
    } catch (err) {
      console.log('consumer A errored', err.message)
    }
  })

  process.nextTick(async () => {
    try {
      for await (const item of items()) {
        console.log('consumer B:', item)
        if (item === 3)
          break
      }
    } catch (err) {
      console.log('consumer B errored', err.message)
    }
  })

  console.log('done....')
}

main()
