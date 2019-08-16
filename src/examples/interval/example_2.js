import {forEach, interval, take, map} from '../../pipeline/browsers'
import {promiseSignal} from '../../lib/promise_helpers'

const delay = period => new Promise(res => setTimeout(res, period))

const consumer = forEach(async x => { await delay(80); console.log(x) })

async function main() {

  console.log('Can abort an interval iteration')

  const cancel = await promiseSignal()
  interval(30000, cancel.promise)
    |> map((x, i) => i)
    |> take(10)
    |> consumer

  cancel.res()

  console.log('done')
}

main()
