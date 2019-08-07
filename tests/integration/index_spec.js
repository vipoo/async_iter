import {sinon, expect, eventually} from '../test_helper'
import path from 'path'
import util from 'util'
import _fs from 'fs'
const fs = _fs.promises

function getExamples() {
  const examples = []
  _fs
    .readdirSync('./src/examples/', {withFileTypes: true})
    .filter(r => r.isDirectory())
    .map(r => r.name)
    .forEach(r => _fs.readdirSync(path.join('src/examples', r))
      .filter(r => r.startsWith('example'))
      .forEach(f => examples.push(path.join(r, path.basename(f, '.js')))))

  return examples
}

function buildDirectExamples(examples) {
  let capture
  const logger = (...args) => {
    capture += args.map(a => (typeof a === 'string' || a instanceof String) ? a : util.inspect(a)).join(' ')
    capture += '\n'
  }

  beforeEach(() => {
    capture = ''
  })

  examples.forEach((e, i) => {
    if (!_fs.existsSync(`./tests/integration/${e}.txt`))
      return it(`${e}.js`)

    it(`${i} - ${e}.js`, async function() {
      this.timeout(3000)
      sinon.stub(console, 'log').callsFake(logger)
      sinon.stub(console, 'error')
      const mod = await import(`../../src/examples/${e}.js`)
      const expected = await fs.readFile(`./tests/integration/${e}.txt`, 'utf-8')

      await mod

      await eventually(() => expect(capture).to.eq(expected)).catch(err => {
        process.stdout.write(capture)
        throw err
      })
      sinon.restore()
    })
  })
}

describe('integration suite', () => {
  buildDirectExamples(getExamples())
})
