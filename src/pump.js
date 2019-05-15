import {promiseSignal} from './lib/promise_helpers'

class ArgumentError extends Error {
  constructor() {
    super('pump callback function has not returned a promise')
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor.name)
  }
}

export function pump(fn, marker) {
  const myObject = new ArgumentError()
  return _pump(fn, marker, myObject)
}

async function* _pump(fn, marker, myObject) {
  let values = undefined
  let keepAlive
  let latch = promiseSignal()
  const unlatch = []
  const keepAliveTimer = () => keepAlive = setTimeout(keepAliveTimer, 250)
  let hasStopped = false
  const hasStoppedSignal = createStopSignal(fn.length >= 2)

  function createStopSignal(callbackRequestsStopSignal) {
    if (!callbackRequestsStopSignal)
      return
    const hasStoppedSignal = promiseSignal()
    hasStoppedSignal.promise.now = () => {
      return hasStopped
    }

    return hasStoppedSignal
  }

  async function _next(item, options = {}) {
    if (hasStopped)
      return {value: undefined, done: true}

    options = {done: false, ...options}
    const p = unlatch.length === 0 ? {marker: 'none'} : unlatch[unlatch.length - 1]
    const newP = promiseSignal()
    unlatch.push(newP)
    await p.promise

    values = {...options, item}
    latch.res()
  }

  function _return() {
    return _next(undefined, {done: true})
  }

  function _throw(error) {
    return _next(undefined, {error})
  }

  async function untilNextValueAvailable() {
    await latch.promise
    latch = promiseSignal({})
  }

  function unLatchNextValue() {
    const p = unlatch.shift()
    p.res()
  }

  function unlatchAll() {
    latch.res()
    for (const p of unlatch)
      p.res()
    unlatch.length = 0
  }

  function extractNextValue() {
    const v = values
    values = undefined
    if (v.error)
      throw v.error
    return v
  }

  process.nextTick(() => {
    async function* _target() {
      let count = 0
      try {
        while (!hasStopped) {
          const x = await (yield count++)
          await _next(x)
        }
      } catch (err) {
        _throw(err)
      } finally {
        await _return()
      }
    }

    const target = _target()

    let operation
    if (hasStoppedSignal)
      operation = fn(target, hasStoppedSignal.promise)
    else
      operation = fn(target)

    if (operation && operation.catch)
      operation.catch(err => _throw(err))
    else
      return _throw(myObject)
  })

  keepAliveTimer()

  function terminateIteration(err) {
    hasStopped = true
    if (hasStoppedSignal)
      if (err) {
        hasStoppedSignal.res(err)
      }
      else
        hasStoppedSignal.res()

    unlatchAll()
    clearTimeout(keepAlive)
    if (err)
      throw err
  }

  try {
    while (true) {
      await untilNextValueAvailable()
      const {item, done} = extractNextValue()

      if (done)
        break

      yield item

      unLatchNextValue()
    }
  } catch (err) {
    terminateIteration(err)
  } finally {
    terminateIteration()
  }
}
