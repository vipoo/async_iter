import {expect} from './test_helper'
import {bufferBy} from '../src/buffer_by'
import {take} from '../src/take'

const delay = period => new Promise(res => setTimeout(res, period))

/***************************************************************/
/* Create a stub source iteration, that can end of be unending */
async function* source(neverEnd = false) {
  yield await 1
  yield await 2
  yield await 3
  yield await 4

  await delay(500)
  yield await 5

  while (neverEnd)
    yield await delay(3000).then(() => 'ignored')
}

describe('#buffer_by', () => {
  it('buffer by single', () => {
    const items = bufferBy(source(), () => true, 0)

    return expect(items).to.iterateTo([[1], [2], [3], [4], [5]])
  })

  it('buffer by twos', () => {
    const items = bufferBy(source(), (i, b) => b.length === 2, 1000)

    return expect(take(items, 2)).to.iterateTo([[1, 2], [3, 4]])
  })

  it('buffer by timeout', async () => {
    const _items = bufferBy(source(true), (i, b) => b.length === 2, 1500)
    const items = _items[Symbol.asyncIterator]()

    await expect(items.next()).to.eventually.deep.eq({value: [1, 2], done: false})
    await expect(items.next()).to.eventually.deep.eq({value: [3, 4], done: false})
    await expect(items.next()).to.eventually.deep.eq({value: [5], done: false})

    items.return()
  })
})
