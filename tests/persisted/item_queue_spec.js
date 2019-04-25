import {delay, expect, sinon, subjectEach} from './../test_helper'
import rmfr from 'rmfr'
import fs from 'fs'
import path from 'path'
import * as uuidModule from '../../src/lib/uuid'
import {pushItem, popItem, removeLast, restoreUnprocessedItems, isEmpty} from '../../src/persisted/item_queue'
import mkdirp from 'mkdirp-promise'

describe('persisted/item_queue', () => {
  const dir = '/tmp'
  const readDirectory = '/tmp/reading'
  const writingDirectory = '/tmp/writing'
  const processingDirectory = '/tmp/processing'
  const data = 'blah data'

  const readFile = (p, _dir) => fs.readFileSync(path.join(dir, p), 'utf-8')

  beforeEach(async () => {
    sinon.stub(process.hrtime, 'bigint')
    for (let i = 0; i < 50; i++)
      process.hrtime.bigint.onCall(i).returns(i + 1)

    sinon.stub(uuidModule, 'uuidv4').returns('a')
  })

  afterEach(() => sinon.restore())

  beforeEach(async () => {
    await rmfr(readDirectory)
    await mkdirp(readDirectory)
    await rmfr(writingDirectory)
    await mkdirp(writingDirectory)
    await rmfr(processingDirectory)
    await mkdirp(processingDirectory)
  })

  describe('#pushItem', () => {
    describe('writes data to the reading directory', () => {
      let state
      beforeEach(() => state = {})
      subjectEach(() => pushItem(readDirectory, writingDirectory, data, state))

      it('write the file with correct content', () =>
        expect(readFile('reading/00000000000001-a')).to.eq(data))

      it('adjusts the tracked byte count', () =>
        expect(state.currentByteCount).to.eq(data.length))
    })

    describe('when maxBytes reached', () => {
      let state
      let overFlowEvent
      beforeEach(() => {
        overFlowEvent = sinon.stub()
        state = {maxBytes: 10, currentByteCount: 20, overFlowEvent}
      })
      subjectEach(() => pushItem(readDirectory, writingDirectory, data, state))

      it('does not write a new file', () =>
        expect(fs.existsSync('/tmp/reading/00000000000001-a')).to.not.be.true)

      it('does not update the byte count', () =>
        expect(state.currentByteCount).to.eq(20))

      it('calls the overFlowEvent callback', () =>
        expect(overFlowEvent).to.have.been.called)
    })
  })

  describe('#popItem', () => {
    describe('awaits for first item', () => {
      let state
      let item
      beforeEach(() => state = {currentByteCount: 20})
      subjectEach(async () => {
        item = popItem(readDirectory, processingDirectory, state)
        await delay(100)
        fs.writeFileSync('/tmp/reading/00000000000001-a', data)
        item = await item
      })

      it('return working dir of filename', () =>
        expect(item.filename).to.eq('/tmp/processing/00000000000001-a'))

      it('has removed file from the readingDirectory', () =>
        expect(fs.existsSync('/tmp/reading/00000000000001-a')).to.be.false)

      it('has return the data as a buffer', () =>
        expect(item.item).to.deep.eq(Buffer.from(data)))

      it('has the correct content in the processing file', () =>
        expect(fs.readFileSync('/tmp/processing/00000000000001-a', 'utf-8')).to.eq(data))

      it('has adjusted the total byte count', () =>
        expect(state.currentByteCount).to.eq(20 - data.length))
    })

    describe('reads the correct order', () => {
      let state
      let item
      beforeEach(() => state = {currentByteCount: 20})
      subjectEach(async () => {
        fs.writeFileSync('/tmp/reading/00000000000002-a', 'blah')
        fs.writeFileSync('/tmp/reading/00000000000001-a', data)

        item = await popItem(readDirectory, processingDirectory, state)
      })

      it('return working dir of filename', () =>
        expect(item.filename).to.eq('/tmp/processing/00000000000001-a'))

      it('has removed file from the readingDirectory', () =>
        expect(fs.existsSync('/tmp/reading/00000000000001-a')).to.be.false)

      it('has return the data as a buffer', () =>
        expect(item.item).to.deep.eq(Buffer.from(data)))

      it('has the correct content in the processing file', () =>
        expect(fs.readFileSync('/tmp/processing/00000000000001-a', 'utf-8')).to.eq(data))

      it('has adjusted the total byte count', () =>
        expect(state.currentByteCount).to.eq(20 - data.length))
    })
  })

  describe('#removeLast', () => {
    describe('given 1 data file and 1 stop file', () => {
      subjectEach(async () => {
        fs.writeFileSync('/tmp/reading/00000000000001-a', data)
        fs.writeFileSync('/tmp/reading/00000000000002-a', '')

        await removeLast(readDirectory)
      })

      it('has removed the file', () =>
        expect(fs.existsSync('/tmp/reading/00000000000002-a')).to.be.false)
    })

    describe('given 1 stop file only', () => {
      subjectEach(async () => {
        fs.writeFileSync('/tmp/reading/00000000000002-a', '')

        await removeLast(readDirectory)
      })

      it('has removed the file', () =>
        expect(fs.existsSync('/tmp/reading/00000000000002-a')).to.be.false)
    })

    describe('given no files', () => {
      let result
      subjectEach(async () => {
        result = removeLast(readDirectory)
      })

      it('does nothing', () =>
        expect(result).to.eventually.be.eq())
    })
  })

  describe('#restoreUnprocessedItems', () => {
    describe('given 2 files in processing', () => {
      let state
      beforeEach(() => state = {})

      subjectEach(async () => {
        fs.writeFileSync('/tmp/processing/00000000000001-a', 'data-1')
        fs.writeFileSync('/tmp/processing/00000000000002-a', 'data-2')

        await restoreUnprocessedItems(readDirectory, processingDirectory, state)
      })

      it('has removed 1st file from processing', () =>
        expect(fs.existsSync('/tmp/processing/00000000000001-a')).to.be.false)

      it('has removed 1st file from processing', () =>
        expect(fs.existsSync('/tmp/processing/00000000000002-a')).to.be.false)

      it('has written the 1st file into reading', () =>
        expect(fs.readFileSync('/tmp/reading/00000000000001-a', 'utf-8')).to.eq('data-1'))

      it('has written the 2nd file into reading', () =>
        expect(fs.readFileSync('/tmp/reading/00000000000002-a', 'utf-8')).to.eq('data-2'))

      it('has updated the byte count', () =>
        expect(state.currentByteCount).to.eq(6 + 6))
    })
  })

  describe('#isEmpty', () => {
    describe('given no files', () => {
      let result
      subjectEach(() => { result = isEmpty(readDirectory) })

      it('returns true', () =>
        expect(result).to.eventually.be.be.true)
    })

    describe('given non existing directory', () => {
      let result
      subjectEach(() => { result = isEmpty('/tmp/blahblah') })

      it('returns true', () =>
        expect(result).to.eventually.be.be.true)
    })

    describe('given 1 file', () => {
      let result
      subjectEach(async () => {
        fs.writeFileSync('/tmp/reading/00000000000002-a', data)

        result = isEmpty(readDirectory)
      })

      it('return false', () =>
        expect(result).to.eventually.be.be.false)
    })
  })
})
