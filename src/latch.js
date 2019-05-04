import {deferredPromise} from './promise_helpers'

export async function* pump(fn) {
  let values = undefined
  let keepAlive
  let latch = deferredPromise()
  const unlatch = []
  const keepAliveTimer = () => keepAlive = setTimeout(keepAliveTimer, 250)
  let hasStopped = false
  const hasStoppedSignal = deferredPromise()

  async function _next(item, options = {}) {
    options = {done: false, ...options}
    const p = unlatch.length === 0 ? {marker: 'none'} : unlatch[unlatch.length - 1]
    const newP = deferredPromise()
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
    latch = deferredPromise({})
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
    hasStoppedSignal.promise.now = () => hasStopped

    target
      .next()
      .then(() => fn(target, hasStoppedSignal.promise))
      .catch(err => _throw(err))
  })

  keepAliveTimer()

  function terminateIteration(err) {
    hasStopped = true
    if (err)
      hasStoppedSignal.rej(err)
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
