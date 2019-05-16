import {expect} from '../test_helper'
import {filter, map, toArray, spawn} from '../../src'
import path from 'path'
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

function buildExamples(examples) {
  describe('iterators', () => {
    examples.forEach((e, i) => {
      if (!_fs.existsSync(`./tests/integration/${e}.txt`))
        return it(`${e}.js`)

      it(`${i} - ${e}.js`, async function() {
        this.timeout(10000)
        const items = (await (spawn('babel-node', [`./src/examples/${e}.js`])
                        |> filter(?, x => x.stdout)
                        |> map(?, x => x.stdout.toString('utf-8'))
                        |> toArray(?))).join('').split('\n')

        const expeted = await fs.readFile(`./tests/integration/${e}.txt`, 'utf-8')
        expect(items).to.deep.eq(expeted.split('\n'))
      })
    })
  })
}

describe('integration suite', () => {
  buildExamples(getExamples())
})
