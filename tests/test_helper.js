import chaiAsPromised from 'chai-as-promised'
export {default as sinon} from 'sinon'
import sinon from 'sinon'
import chai from 'chai'
import sinonChai from 'sinon-chai'

chai.use(chaiAsPromised)
chai.use(sinonChai)

export const expect = chai.expect
export const subjectEach = beforeEach

afterEach(() => sinon.restore())

const delay = period => new Promise(res => setTimeout(res, period))

chai.Assertion.addMethod('iterateTo', async function(expectedValues) {
  const result = []
  for await (const x of this._obj)
    result.push(x)

  return new chai.Assertion(result).to.deep.eq(expectedValues)
})

const unique = Symbol('unique')
async function getPromiseState(p) {
  return Promise.race([p, Promise.resolve(unique)])
    .then(y => y === unique ? 'pending' : 'resolved', () => 'rejected')
}

chai.Assertion.addProperty('pending', async function() {
  const state = await getPromiseState(this._obj)

  if (this.__flags.negate)
    return new chai.Assertion(state).to.not.eq('pending')
  else
    return new chai.Assertion(state).to.eq('pending')
})

export async function eventually(fn, timeout = 1900) {
  let lastError = null
  let timedOut = false
  const timer = setTimeout(() => timedOut = true, timeout)

  while (!timedOut)
    try {
      return await fn()
    } catch (err) {
      lastError = err
      await delay(10)
    }

  clearTimeout(timer)
  throw lastError
}
