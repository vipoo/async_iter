import {fakeTimer, expect, subjectEach, sinon, eventually, delay} from './test_helper'
import {interval, intervalNonQueuing} from '../src'
import * as latchModule from '../src/latch'

describe('interval', () => {
  let items
  let clock
  const stubLatch = {}
  const stubItems = 'stubItems'

  beforeEach(() => {
    const stubHrTime = {}
    stubHrTime.bigint = sinon.stub().returns(1)
    sinon.stub(process, 'hrtime').value(stubHrTime)

    clock = fakeTimer()
    stubLatch.items = sinon.stub().returns(stubItems)
    sinon.stub(latchModule, 'createLatch').resolves(stubLatch)
  })

  afterEach(() => {
    clock.restore()
    sinon.restore()
  })

  describe('When stops consuming after 3 items', () => {
    beforeEach(() => {
      stubLatch.hasStoppedConsuming = sinon.stub()
        .onCall(0).returns(false)
        .onCall(1).returns(false)
        .onCall(2).returns(false)
        .onCall(3).returns(true)
    })

    describe('#intervalNonQueuing', () => {
      let res

      beforeEach(() => {
        const p = new Promise((_res) => res = _res)
        stubLatch.push = sinon.stub().returns(p)
      })

      subjectEach(async () => items = await intervalNonQueuing(1000))

      it('returns the latch items', () =>
        expect(items).to.eq(stubItems))

      it('has initially pushed no items', async () => {
        await delay(0)
        expect(stubLatch.push).to.not.have.been.called
      })

      describe('after 1 interval has elapsed', () => {
        beforeEach(() => clock.tick(1000))

        it('pushes an hrtime value', () =>
          eventually(() => expect(stubLatch.push).to.have.been.calledWith(1)))

        describe('after 1 more intervals', () => {
          beforeEach(() => clock.tick(1000))

          it('does not push next value', async () => {
            await delay(0)
            expect(stubLatch.push).to.have.been.calledOnce
          })

          describe('after consumer consumes the item', () => {
            beforeEach(() => res())

            it('does not push next value', async () => {
              await delay(0)
              expect(stubLatch.push).to.have.been.calledOnce
            })

            describe('after another interval', () => {
              beforeEach(() => clock.tick(1000))

              it('next value is emitted', async () => {
                await delay(0)
                expect(stubLatch.push).to.have.been.calledTwice
              })
            })
          })
        })
      })
    })

    describe('#interval', () => {
      beforeEach(() => stubLatch.push = sinon.stub())

      subjectEach(async () => items = await interval(1000))

      it('returns the latch items', () =>
        expect(items).to.eq(stubItems))

      it('has initially pushed no items', async () => {
        await delay(0)
        expect(stubLatch.push).to.not.have.been.called
      })

      describe('after 1 interval has elapsed', () => {
        beforeEach(() => clock.tick(1000))

        it('pushes an hrtime value', () =>
          eventually(() => expect(stubLatch.push).to.have.been.calledWith(1)))

        describe('after 4 more intervals', () => {
          beforeEach(() => clock.tick(4000))

          it('pushes another value', async () => {
            await delay(0)
            expect(stubLatch.push).to.have.been.calledThrice
          })
        })
      })
    })
  })
})
