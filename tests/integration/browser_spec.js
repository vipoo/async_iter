import {sinon, expect} from '../test_helper'

function formatLikeConsole(arg) {
  if (arg instanceof Array)
    return JSON.stringify(arg).replace(/,/g, ', ').replace(/\[/g, '[ ').replace(/]/g, ' ]')
  return arg
}

if (process.env.BROWSER_TEST)
  describe('integration suite', () => {
    let capture
    const logger = (...args) => {
      capture += args.map(a => formatLikeConsole(a)).join(' ')
      capture += '\n'
    }

    beforeEach(() => {
      capture = ''
      sinon.stub(console, 'log').callsFake(logger)
    })

    integrationTests.forEach((e, i) => { // eslint-disable-line
      it(`${i} - ${e}.js`, async function() {
        const mod = await import(`../../src/examples/${e}.js`)
        const output = await import(`./${e}.txt`)

        await mod.default
        expect(capture).to.eq(output.default)
      })
    })
  })
