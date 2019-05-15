import {expect, eventually} from './test_helper'
import {pump} from '../src'

const delay = period => new Promise(res => setTimeout(res, period))

describe('#pump', () => {
  it('raises error is not passed an async function', async () => {
    const items = await pump((t, s) => {})

    return expect(items.next()).to.be.rejectedWith('pump callback function has not returned a promise')
  })

  it('push items are blocked, until consumed', async () => {
    let p1, p2, p3, hasStopped
    const items = await pump(async (t, s) => {
      hasStopped = s
      await t.next()
      p1 = await t.next(1)
      p2 = await t.next(2)
      p3 = await t.next(3)
    })

    //start
    items.next()

    await delay(100)
    expect(p1).to.be.deep.eq({value: 1, done: false})
    expect(p2).to.be.undefined
    expect(p3).to.be.undefined

    await items.next()
    await delay(100)

    expect(p1).to.deep.eq({value: 1, done: false})
    expect(p2).to.deep.eq({value: 2, done: false})
    expect(p3).to.be.undefined

    expect(hasStopped).to.be.pending
    await items.return()
    await expect(hasStopped).to.eventually.be.fulfilled
    await eventually(() => expect(p3).to.deep.eq({value: undefined, done: true}))
  })

  it('push items, then iterate', async () => {
    const items = await pump((async t => {
      await t.next()
      await t.next(1)
      await t.next(2)
      await t.return()
    }))

    await delay(100)
    await expect(items).to.iterateTo([1, 2])
  })

  it('push items, then iterate async', async () => {
    const items = await pump(async t => {
      await delay(100)
      await t.next()
      await t.next(1)
      await t.next(2)
      await t.return()
    })

    await expect(items).to.iterateTo([1, 2])
  })

  it('push error, then iterate throws', async () => {
    let hasStopped
    const error = new Error('blah')
    const items = await pump(async (t, s) => {
      hasStopped = s
      await t.next()
      await t.next(1)
      await t.next(2)
      await t.throw(error)
    })

    await expect(items.next()).to.eventually.deep.eq({value: 1, done: false})
    await expect(items.next()).to.eventually.deep.eq({value: 2, done: false})
    await expect(items.next()).to.eventually.be.rejectedWith('blah')

    expect(hasStopped.now()).to.be.true

    await expect(hasStopped).to.eventually.be.eq(error)
  })

  it('push items concurrently, then iterate async', async () => {
    const items = await pump(async t => {
      await Promise.all([t.next(), t.next(1), t.next(2)])
      await t.return()
    })

    return expect(items).to.iterateTo([1, 2])
  })

  it('push items slowly, then iterate async', async () => {
    let hasStopped
    const items = await pump(async (t, s) => {
      hasStopped = s
      await t.next()
      await t.next(1)
      await delay(100)
      await t.next(2)
      await delay(100)
      await t.next(3)
      await delay(100)
      await t.return()
    })

    await expect(items).to.iterateTo([1, 2, 3])
    await expect(hasStopped).to.eventually.be.fulfilled
  })

  it('push items, then iterate slowly', async () => {
    let hasStopped
    const items = await pump(async (t, s) => {
      hasStopped = s
      await Promise.all([
        t.next(),
        t.next(1),
        t.next(2),
        t.next(3)
      ])
      await t.return()
    })

    const result = []
    for await (const r of items) {
      await delay(100)
      result.push(r)
      await delay(0)
      expect(hasStopped).to.be.pending
    }
    expect(hasStopped).to.be.fulfilled
    await expect(result).to.iterateTo([1, 2, 3])
  })
})
