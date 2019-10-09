import {pump} from './pump'
import {promiseSignal} from './lib/promise_helpers'

/**
```
import {map} from 'async_iter/pipeline/backlog_limit' # pipeline version
import {map} from 'async_iter/backlog_limit' # conventional version
```
Buffers items upto a limit count to pass onto consumer.

> Supports only **async** iterations

Useful when your consumer is slower than your producer, and causes source items
to be dropped.

 * @param  {Iterable}       source       The source iteration to process
 * @param  {Number}         count        The max number of items to buffer
 * @return {Iterable} The limited items
 * @function
 * @name backlogLimit
 * @memberof module:Operators
 */

export function backlogLimit(source, count) {
  const buffer = []
  let isFinished = false
  let signal = promiseSignal()

  process.nextTick(async () => {
    try {
      for await (const item of source)
        if (buffer.length < count) {
          buffer.push(item)
          signal.res()
        } else
          buffer[buffer.length - 1] = item
    } finally {
      isFinished = true
    }
  })

  return pump(async target => {
    await target.next()
    while (!isFinished || buffer.length > 0)
      if (buffer.length === 0) {
        await signal.promise
        signal = promiseSignal()
      } else {
        const p = buffer.shift()
        await target.next(await p)
      }

    target.return()
  })
}
