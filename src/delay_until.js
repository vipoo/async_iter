import {asAsyncIterator} from './lib/get_iterator'

const delayPromise = period => new Promise(res => setTimeout(res, period))

export async function* delayUntil(source, date) {
  source = await asAsyncIterator(source)
  date = new Date(date)

  await delayPromise(date.getTime() - Date.now())

  yield* source
}
