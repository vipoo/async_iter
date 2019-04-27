import {delay, expect, sinon, eventually, subjectEach} from './test_helper'
import {createLatch, persisted, map} from '../src'
import * as uuidModule from '../src/lib/uuid'
import rmfr from 'rmfr'
import fs from 'fs'
import path from 'path'

/***************************************************************/
/* Create a persisted source in a specific directory */
/* Clean directory unless a specific directory given */
let dir
let count = 1

function getNextDir() {
  return `/tmp/test-store-${count++}`
}

function persistedSource(_dir = undefined, opts = {}) {
  opts = {neverEnd: false, allowRestart: false, ...opts}
  const {neverEnd} = opts
  dir = _dir || getNextDir()
  const clean = _dir ? Promise.resolve() : rmfr(dir)

  return clean.then(() => persisted(source(neverEnd), dir, opts))
}

const readFile = (p, _dir) => fs.readFileSync(path.join(_dir || dir, p), 'utf-8')
const exists = p => fs.existsSync(path.join(dir, p), 'utf-8')

/***************************************************************/
/* Create a stub source iteration, that can end of be unending */
let sourceHasStopped
let sourceReachStage1
async function* source(neverEnd) {
  try {
    sourceReachStage1 = false
    sourceHasStopped = false
    yield await 1
    yield await 2

    sourceReachStage1 = true
    if (neverEnd) {
      yield await 3
      yield await 4
      yield await 5
    }

    while (neverEnd) {
      await delay(100)
      yield 'neverEnd'
    }
  } finally {
    sourceHasStopped = true
  }
}

describe('#persisted', () => {
  beforeEach(async () => {
    sinon.stub(process.hrtime, 'bigint')
    for (let i = 0; i < 50; i++)
      process.hrtime.bigint.onCall(i).returns(i + 1)

    sinon.stub(uuidModule, 'uuidv4').returns('a')
  })

  afterEach(() => sinon.restore())

  let items
  describe('single iterations', () => {
    subjectEach(async () => items = await persistedSource())

    it('has stored the first item', () =>
      eventually(() => expect(readFile('reading/00000000000001-a')).to.eq('1')))

    it('has stored the second item', () =>
      eventually(() => expect(readFile('reading/00000000000002-a')).to.eq('2')))

    it('has stored the stop signal file', () =>
      eventually(() => expect(readFile('reading/00000000000003-a')).to.eq('')))

    it('has marked the iteration as stopped', () =>
      eventually(() => expect(readFile('stopped')).to.eq('')))

    it('it emits the first item', async () => {
      const firstItem = await items.next()
      expect(firstItem.value.value.toString()).to.eq('1')
      expect(firstItem.done).to.be.false
    })

    it('it has 2 items', async () => {
      return expect(items |> map(?, i => i.value.toString())).to.iterateTo(['1', '2'])
    })

    it('moves the file after retrieval', async () => {
      await eventually(() => expect(exists('reading/00000000000001-a')).to.be.true)
      await items.next()
      expect(exists('reading/00000000000001-a')).to.be.false
      expect(exists('processing/00000000000001-a')).to.be.true
    })

    it('deletes the file after completing', async () => {
      const item = await items.next()
      expect(exists('processing/00000000000001-a')).to.be.true
      await item.value.completed()
      expect(exists('processing/00000000000001-a')).to.be.false
    })
  })

  describe('reuse of iteration', () => {
    it('it allows reuse after source is fully consumed', async () => {
      await rmfr('/tmp/test-store-reuse')
      let items = await persistedSource('/tmp/test-store-reuse')
      for await (const item of items)
        await item.completed()

      await eventually(() => expect(readFile('stopped')).to.eq(''))

      items = await persistedSource('/tmp/test-store-reuse')

      return expect(items |> map(?, i => i.value.toString())).to.iterateTo(['1', '2'])
    })

    it('can resume from an aborted iteration', async () => {
      sourceReachStage1 = false
      sourceHasStopped = false
      await rmfr('/tmp/test-store-resume')
      const itemSet1 = await persistedSource('/tmp/test-store-resume', {neverEnd: true})
      await eventually(() => expect(sourceReachStage1).to.be.true)
      try {
        const firstItem = await itemSet1.next()
        await firstItem.value.completed()
        await itemSet1.return()
        const itemSet2 = await persistedSource('/tmp/test-store-resume', {neverEnd: false})

        return expect(itemSet2 |> map(?, i => i.value.toString())).to.iterateTo(['2', '3', '4', '5', '1', '2'])
      } finally {
        itemSet1.return()
      }
    })

    it('stops consuming if consumer stops', async () => {
      sourceHasStopped = false
      const itemSet1 = await persistedSource(undefined, {neverEnd: true})
      await itemSet1.next()
      await itemSet1.return()
      return eventually(() => expect(sourceHasStopped).to.be.true)
    })

    it('prevents multiple iterations to be stored', async () => {
      sourceHasStopped = false
      await rmfr('/tmp/test-store-repeat')
      await persistedSource('/tmp/test-store-repeat', {neverEnd: false})
      await eventually(() => expect(sourceHasStopped).to.be.true)
      await eventually(() => expect(readFile('stopped', '/tmp/test-store-repeat')).to.eq(''))

      return expect(persistedSource('/tmp/test-store-repeat', {neverEnd: false})).to.be.rejectedWith('Attempt to restart when a previous stopped non-empty iteration exists')
    })

    it('allow previous store/completed iteration to be consumed', async () => {
      sourceHasStopped = false
      await rmfr('/tmp/test-store-repeat')
      await persistedSource('/tmp/test-store-repeat', {neverEnd: false})
      await eventually(() => expect(sourceHasStopped).to.be.true)
      await eventually(() => expect(readFile('stopped', '/tmp/test-store-repeat')).to.eq(''))

      const items = await persistedSource('/tmp/test-store-repeat', {neverEnd: false, allowRestart: true})
      return expect(items |> map(?, i => i.value.toString())).to.iterateTo(['1', '2', '1', '2'])
    })
  })

  describe('data types', () => {
    let source
    beforeEach(async () => {
      source = await createLatch()
      source.push('a string')
      source.push(123)
      source.push(Buffer.from('a buffer'))
      source.push({a: 'not - supported - object'})
    })

    let mappedItems
    subjectEach(async () => {
      const dir = getNextDir()
      await rmfr(dir)

      const items = await persisted(source.items(), dir)
      mappedItems = items |> map(?, i => i.value)
    })

    afterEach(() => source.stop())

    it('emits correct typed data', async () => {
      await expect(mappedItems.next()).to.eventually.deep.eq({value: Buffer.from('a string'), done: false})
      await expect(mappedItems.next()).to.eventually.deep.eq({value: Buffer.from('123'), done: false})
      await expect(mappedItems.next()).to.eventually.deep.eq({value: Buffer.from('a buffer'), done: false})
      await expect(mappedItems.next()).to.eventually.deep.eq({value: Buffer.from('[object Object]'), done: false})
    })

  })

  describe('shutting/stopping iteration', () => {
    let source

    it('terminates an empty iterations', async () => {
      source = await createLatch()

      const dir = getNextDir()
      await rmfr(dir)
      const items = await persisted(source.items(), dir)
      const nextValue = items.next()

      source.stop()

      await expect(nextValue).to.eventually.deep.eq({value: undefined, done: true})
    })

  })

  describe('maxBytes of 6', () => {
    let source
    let sourceConsumed
    beforeEach(async () => {
      source = await createLatch()
      source.push('aaa')
      source.push('bbb')
      source.push('ccc')
      sourceConsumed = source.push('ddd')
    })

    let mappedItems
    subjectEach(async () => {
      const dir = getNextDir()
      await rmfr(dir)

      const items = await persisted(source.items(), dir, {maxBytes: 6})
      mappedItems = items |> map(?, i => i.value.toString())
    })

    afterEach(() => source.stop())

    it('emits uptop maxBytes', async () => {
      await expect(mappedItems.next()).to.eventually.deep.eq({value: 'aaa', done: false})
      await expect(mappedItems.next()).to.eventually.deep.eq({value: 'bbb', done: false})
    })

    it('drops items beyond maxBytes', async () => {
      await expect(sourceConsumed).to.eventually.eq(1)
      await mappedItems.next()
      await mappedItems.next()

      source.push('eee')
      await expect(mappedItems.next()).to.eventually.deep.eq({value: 'eee', done: false})
    })
  })
})
