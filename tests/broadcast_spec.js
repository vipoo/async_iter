import {expect, delay, eventually} from './test_helper'
import {broadcast, toArray} from '../src/browsers'

const forTicks = () => new Promise(res => process.nextTick(res))

describe('#broadcast', () => {
  describe('Given a source iteration of 5 items', () => {
    let subscribeToSource
    let hasReachedEnd
    let hasAbortedIteration
    async function* source() {
      try {
        yield await 1
        yield await 2
        yield await 3
        hasAbortedIteration = true
        yield await 4
        yield await 5
      } finally {
        hasReachedEnd = true
      }
    }

    beforeEach(() => {
      hasReachedEnd = false
      hasAbortedIteration = false
      subscribeToSource =  broadcast(source())
    })

    afterEach(async () => {
      subscribeToSource.return()
    })

    it('passes thru iterations once', async () => {
      await expect(subscribeToSource()).to.iterateTo([1, 2, 3, 4, 5])
      expect(() => subscribeToSource()).to.throw('Source iteration has already completed')
    })

    it('when a the consumer stops, the source is stopped', async () => {
      const setA = subscribeToSource()

      await setA.next()
      await setA.next()
      await setA.return()

      expect(hasReachedEnd).to.be.false
      expect(hasAbortedIteration).to.be.false

      subscribeToSource.return()
      await eventually(() => expect(hasReachedEnd).to.be.true)
    })

    it('allows 2 subscribeToSourcers to iteration', async () => {
      const setA = toArray(subscribeToSource())
      const setB = toArray(subscribeToSource())

      await expect(setA).to.eventually.deep.eq([1, 2, 3, 4, 5])
      await expect(setB).to.eventually.deep.eq([1, 2, 3, 4, 5])
    })

    it('Allows joining an iteration thats already started (exclusive)', async () => {
      const setA = subscribeToSource(), setB = subscribeToSource()

      await expect(setA.next()).to.eventually.deep.eq({value: 1, done: false})
      await expect(setA.next()).to.eventually.deep.eq({value: 2, done: false})
      const b2 = setB.next()
      await forTicks()
      expect(setA.next()).to.eventually.deep.eq({value: 3, done: false})
      await expect(b2).to.eventually.deep.eq({value: 4, done: false})

      const nextResults = await Promise.all([setA.next(), setB.next()])
      expect(nextResults[0]).to.deep.eq({value: 4, done: false})
      expect(nextResults[1]).to.deep.eq({value: 5, done: false})
    })

    it('Allows joining an iteration thats already started (inclusive)', async () => {
      const setA = subscribeToSource()
      const setB = subscribeToSource(true)

      await expect(setA.next()).to.eventually.deep.eq({value: 1, done: false})
      await expect(setA.next()).to.eventually.deep.eq({value: 2, done: false})

      await expect(setB.next()).to.eventually.deep.eq({value: 3, done: false})
      await expect(setA.next()).to.eventually.deep.eq({value: 3, done: false})

      const nextResults = await Promise.all([setA.next(), setB.next()])
      expect(nextResults[0]).to.deep.eq({value: 4, done: false})
      expect(nextResults[1]).to.deep.eq({value: 4, done: false})
    })

    it('when one consumer stops, others continue', async () => {
      const setA = subscribeToSource()
      const setB = subscribeToSource()

      await Promise.all([setA.next(), setB.next()])
      await expect(setA.next()).to.eventually.deep.eq({value: 2, done: false})
      await expect(setB.next()).to.eventually.deep.eq({value: 2, done: false})
      await expect(setA.return()).to.eventually.deep.eq({value: undefined, done: true})
      await expect(setB.next()).to.eventually.deep.eq({value: 3, done: false})
      await expect(setB.next()).to.eventually.deep.eq({value: 4, done: false})
      await expect(setB.next()).to.eventually.deep.eq({value: 5, done: false})
      await expect(setB.next()).to.eventually.deep.eq({value: undefined, done: true})
    })

    it('when all consumers stop, source is not stopped', async () => {
      const setA = subscribeToSource()
      const setB = subscribeToSource()

      await Promise.all([setA.next(), setB.next()])
      await Promise.all([setA.next(), setB.next()])
      await Promise.all([setA.return(), setB.return()])

      expect(hasReachedEnd).to.be.false
      expect(hasAbortedIteration).to.be.false
    })

    it('broadcaster is stopped, source is stopped', async () => {
      const setA = subscribeToSource()
      const setB = subscribeToSource()

      await Promise.all([setA.next(), setB.next()])
      await Promise.all([setA.next(), setB.next()])
      await Promise.all([setA.return(), setB.return()])

      expect(hasReachedEnd).to.be.false
      expect(hasAbortedIteration).to.be.false

      const setC = subscribeToSource()
      await expect(setC.next()).to.eventually.deep.eq({value: 4, done: false})

      await subscribeToSource.return()
      await expect(setC.next()).to.eventually.deep.eq({value: undefined, done: true})
      await eventually(() => expect(hasReachedEnd).to.be.true)
    })

    it('consumers are sync', async () => {
      const setA = subscribeToSource()
      const setB = subscribeToSource()

      await Promise.all([setA.next(), setB.next()])

      await expect(setB.next()).to.eventually.deep.eq({value: 2, done: false})

      const p4 = setB.next()
      await delay(100)
      await expect(p4).to.be.pending

      setA.next()
      await expect(p4).to.eventually.deep.eq(({value: 3, done: false}))
    })
  })

  describe('Given a source iteration of that raises an error', () => {
    describe('When source iteration error, error is passed to all consumers', async () => {
      async function* source() {
        yield await 1
        throw new Error('blah')
      }

      let setA1, setA2, setB1, setB2
      beforeEach(async () => {
        const items = broadcast(source())

        const setA = items()
        const setB = items()
        await Promise.all([setA.next(), setB.next()])

        setA1 = setA.next()
        setA2 = setA.next()
        setB1 = setB.next()
        setB2 = setB.next()
      })

      it('both sets are rejected then done', async () => {
        await expect(setA1).to.eventually.be.rejectedWith('blah')
        await expect(setB1).to.eventually.be.rejectedWith('blah')
        await expect(setA2).to.eventually.deep.eq({value: undefined, done: true})
        await expect(setB2).to.eventually.deep.eq({value: undefined, done: true})
      })
    })
  })
})
