import {sinon, expect} from '../test_helper'

if (process.env.BROWSER_TEST)
  describe('integration suite', () => {
    it('#broadcast/example_1', async () => {
      let capture = ''
      const logger = (...args) => {
        capture += args.map(a => a.toString()).join(' ')
        capture += '\n'
      }
      sinon.stub(console, 'log').callsFake(logger)

      const mod = await import('../../src/examples/broadcast/example.js')
      const output = await import('./broadcast/example.txt')

      await mod.default
      expect(capture).to.eq(output.default)
    })
  })
