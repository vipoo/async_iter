import {expect} from '../test_helper'
import {pump, map, toArray} from '../../src'
import childProcess from 'child_process'
import path from 'path'
import _fs from 'fs'
const fs = _fs.promises

export async function spawn(...args) {
  const output = await (pump(async (target, hasStopped) => {
    target.next()
    const p = childProcess.spawn(...args)

    p.stdout.on('data', stdout => target.next(stdout))
    p.on('close', code => code === 0 ? target.return() : target.throw(new Error('Non zero exit')))

    hasStopped.then(() => p.kill())
  })
    |> map(?, x => x.toString('utf-8'))
    |> toArray(?))

  return output.join('')
}

function getExamples() {
  const examples = []
  _fs
    .readdirSync('./src/examples/', {withFileTypes: true})
    .filter(r => r.isDirectory())
    .map(r => r.name)
    .forEach(r => _fs.readdirSync(path.join('src/examples', r))
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
        const items = await spawn('babel-node', [`./src/examples/${e}.js`])
        const expeted = await fs.readFile(`./tests/integration/${e}.txt`, 'utf-8')
        expect(items.split('\n')).to.deep.eq(expeted.split('\n'))
      })
    })
  })
}

describe('integration suite', () => {
  buildExamples(getExamples())
})
