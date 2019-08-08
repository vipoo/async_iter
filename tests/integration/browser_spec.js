import {sinon, expect, eventually} from '../test_helper'
import util from 'util'

if (process.env.BROWSER_TEST)
  describe('integration suite', () => {
    let capture
    const logger = (...args) => {
      capture += args.map(a => (typeof a === 'string' || a instanceof String) ? a : util.inspect(a)).join(' ')
      capture += '\n'
    }

    beforeEach(() => {
      capture = ''
    })

    integrationTests.forEach((e, i) => { // eslint-disable-line
      it(`${i} - ${e}.js`, async function() {
        this.timeout(3000)
        sinon.stub(console, 'log').callsFake(logger)
        sinon.stub(console, 'error')
        const mod = await import(`../../src/examples/${e}.js`)
        const output = await import(`./${e}.txt`)

        await mod.default
        await eventually(() => expect(capture).to.eq(output.default)).catch(err => {
          sinon.restore()
          console.log(capture) //eslint-disable-line
          throw err
        })
        sinon.restore()
      })
    })
  })
