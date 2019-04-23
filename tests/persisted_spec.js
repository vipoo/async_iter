import {expect, sinon, eventually, subjectEach} from './test_helper'
import {persisted, map} from '../src'
import * as uuidModule from '../src/lib/uuid'
import rmfr from 'rmfr'
import fs from 'fs'
import path from 'path'

const delay = period => new Promise(res => setTimeout(res, period))

/***************************************************************/
/* Create a persisted source in a specific directory */
/* Clean directory unless a specific directory given */
let dir
let count = 1
function persistedSource(_dir = undefined, opts = {}) {
  opts = {neverEnd: false, allowRestart: false, ...opts}
  const {neverEnd} = opts
  dir = _dir || `/tmp/test-store-${count++}`
  const clean = _dir ? Promise.resolve() : rmfr(dir)

  return clean.then(() => persisted(source(neverEnd), dir, opts))
}

const readFile = (p, _dir) => fs.readFileSync(path.join(_dir || dir, p), 'utf-8')
const exists = p => fs.existsSync(path.join(dir, p), 'utf-8')

/***************************************************************/
/* Create a stub source iteration, that can end of be unending */
let sourceHasStopped
async function* source(neverEnd) {
  try {
    sourceHasStopped = false
    yield await 1
    yield await 2

    while (neverEnd)
      yield await delay(100)
  } finally {
    sourceHasStopped = true
  }
}

describe('#persisted', () => {
  beforeEach(async () => {
    sinon.stub(process.hrtime, 'bigint')
    for (let i = 0; i < 10; i++)
      process.hrtime.bigint.onCall(i).returns(i + 1)

    sinon.stub(uuidModule, 'uuidv4').returns('a')
  })

  let items
  describe('single iterations', () => {
    subjectEach(async () => items = await persistedSource())

    it('has stored the first item', () =>
      eventually(() => expect(readFile('reading/1-a')).to.eq('1')))

    it('has stored the second item', () =>
      eventually(() => expect(readFile('reading/2-a')).to.eq('2')))

    it('has stored the stop signal file', () =>
      eventually(() => expect(readFile('reading/3-a')).to.eq('')))

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
      await eventually(() => expect(exists('reading/1-a')).to.be.true)
      await items.next()
      expect(exists('reading/1-a')).to.be.false
      expect(exists('processing/1-a')).to.be.true
    })

    it('deletes the file after completing', async () => {
      const item = await items.next()
      expect(exists('processing/1-a')).to.be.true
      await item.value.completed()
      expect(exists('processing/1-a')).to.be.false
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
      await rmfr('/tmp/test-store-resume')
      const itemSet1 = await persistedSource('/tmp/test-store-resume', {neverEnd: true})
      try {
        const firstItem = await itemSet1.next()
        await firstItem.value.completed()
        const itemSet2 = await persistedSource('/tmp/test-store-resume', {neverEnd: false})

        return expect(itemSet2 |> map(?, i => i.value.toString())).to.iterateTo(['2', '1', '2'])
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
})
