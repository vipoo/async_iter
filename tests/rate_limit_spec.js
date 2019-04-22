import {expect, sinon, subjectEach} from './test_helper'
import {rateLimit} from '../src'

/***************************************************************/
/* Create a stub source iteration, that can end of be unending */
let yieldedTo
async function* source() {
  yieldedTo = undefined
  yield await 'aaaaa'
  yieldedTo = 'aaaaa'
  yield await 'bbbbb'
  yieldedTo = 'bbbbb'
  yield await 'ccccc'
  yieldedTo = 'ccccc'
  yield await 'ignored'
}

describe('#rateLimit', () => {
  let clock
  let items

  beforeEach(() => clock = sinon.useFakeTimers())
  afterEach(() => clock.restore())

  subjectEach(() => { items = source() |> rateLimit(?, 5, 1000, v => v.toString().length) })

  it('emit the first value immediatly', () =>
    expect(items.next()).to.eventually.deep.eq({value: 'aaaaa', done: false}))

  it('rate limits the consumtion of 2nd item', async () => {
    await items.next()
    items.next()
    clock.tick(990)
    expect(yieldedTo).to.eq('aaaaa')
  })

  it('emits the 2nd item after throttle period', async () => {
    await items.next()
    const p = items.next()
    clock.tick(1000)
    await expect(p).to.eventually.deep.eq({value: 'bbbbb', done: false})
  })

  it('emit values at a controlled rate', async () => {
    await expect(items.next()).to.eventually.deep.eq({value: 'aaaaa', done: false})

    const p = items.next()
    expect(yieldedTo).to.eq('aaaaa')
    clock.tick(990)
    expect(yieldedTo).to.eq('aaaaa')

    clock.tick(10)
    await expect(p).to.eventually.deep.eq({value: 'bbbbb', done: false})

    items.next()
    expect(yieldedTo).to.eq('bbbbb')
  })
})
