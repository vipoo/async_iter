import {fakeTimer, expect, sinon, delay} from './test_helper'
import {interval} from '../src'

describe('interval', () => {
  let clock
  beforeEach(() => {
    const stubHrTime = {}
    stubHrTime.bigint = sinon.stub().onCall(0).returns(1).onCall(1).returns(2)
    sinon.stub(process, 'hrtime').value(stubHrTime)

    clock = fakeTimer()
  })

  afterEach(() => {
    clock.restore()
    sinon.restore()
  })

  it('Emits on interval', async () => {
    const items = await interval(1000)
    const firstItem = items.next()
    await delay(0)
    expect(firstItem).to.be.pending

    clock.tick(1000)
    await expect(firstItem).to.eventually.deep.eq({value: 1, done: false})

    clock.tick(10000)

    expect(items.next()).to.be.pending
    items.return()
    await expect(items.next()).to.eventually.deep.eq({value: undefined, done: true})
  })
})
