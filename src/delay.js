import {asAsyncIterator} from './lib/get_iterator'

const delayPromise = period => new Promise(res => setTimeout(res, period))

export async function* delay(source, period) {
  source = await asAsyncIterator(source)

  for await (const item of source) {
    await delayPromise(period)
    yield item
  }
}
