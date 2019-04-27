import {expect} from './test_helper'
import {createLatch} from '../src'

const delay = period => new Promise(res => setTimeout(res, period))

describe('#createLatch', () => {
  it('push items are blocked, until consumed', async () => {
    const {push, items, hasStopped} = await createLatch()

    const p1 = push(1)
    const p2 = push(2)
    const p3 = push(3)

    await delay(100)
    await expect(p1).to.eventually.be.eq(3)
    await expect(p2).to.be.pending
    await expect(p3).to.be.pending

    const item = items()
    await item.next()
    await item.next()
    await delay(100)

    await expect(p1).to.eventually.be.eq(3)
    await expect(p2).to.eventually.be.eq(2)
    await expect(p3).to.be.pending

    expect(hasStopped).to.be.pending
    await item.return()
    await expect(hasStopped).to.eventually.be.deep.eq({done: true})
  })

  it('push items, then iterate', async () => {
    const {push, stop, items} = await createLatch()
    push(1).then(() => push(2)).then(() => stop())

    await expect(items()).to.iterateTo([1, 2])
  })

  it('push items, then iterate async', async () => {
    const {push, stop, items} = await createLatch()

    const p = expect(items()).to.iterateTo([1, 2])
    await push(1)
    await push(2)
    await stop()
    await p
  })

  it('push error, then iterate throws', async () => {
    const {push, abort, items, hasStopped} = await createLatch()

    push(1).then(() => push(2)).then(() => abort(new Error('blah')))

    const item = items()

    await expect(item.next()).to.eventually.deep.eq({value: 1, done: false})
    await expect(item.next()).to.eventually.deep.eq({value: 2, done: false})
    await expect(item.next()).to.eventually.be.rejectedWith('blah')

    await expect(hasStopped).to.eventually.be.deep.eq({done: true})
  })

  it('push items concurrently, then iterate async', async () => {
    const {push, stop, items} = await createLatch()

    Promise.all([push(1), push(2)]).then(() => stop())

    return expect(items()).to.iterateTo([1, 2])
  })

  it('push items slowly, then iterate async', async () => {
    const {push, stop, items, hasStopped} = await createLatch()

    const p = expect(items()).to.iterateTo([1, 2, 3])
    await push(1)
    await delay(100)
    await push(2)
    await delay(100)
    await push(3)
    await delay(100)
    expect(hasStopped).to.be.pending
    await stop()
    await p
    await expect(hasStopped).to.eventually.be.deep.eq({done: true})
  })

  it('push items, then iterate slowly', async () => {
    const {push, stop, items, hasStopped} = await createLatch()
    Promise.all([push(1), push(2), push(3)]).then(() => stop())

    const result = []
    for await (const r of items()) {
      await delay(100)
      result.push(r)
      await delay(0)
      expect(hasStopped).to.be.pending
    }
    await expect(hasStopped).to.eventually.be.deep.eq({done: true})
    await expect(result).to.iterateTo([1, 2, 3])
  })
})
