import {open} from './storage'

/**
```
import {persisted} from 'async_iter/pipeline/persisted' # pipeline version
import {persisted} from 'async_iter/persisted' # conventional version
```
Persist items of an async iterator to files for later resumption
> NB: `Persisted` will consume items as fast as the source will emit.  The consumer of the iteration will be 'decoupled' from the source

 * @param {Iterable} source   The source iteration
 * @param  {String} path    is a directory for storage of items
 * @param  {Object} opts   a set of optional flags
 * @param  {boolean} [opts.allowRestart=false]   allows a restart of a previously completed iteration
 * @param  {boolean} [opts.maxBytes=0]   limits the number of bytes that can be stored. Zero indicates no limit
 * @param  {overFlowEventCallback} [opts.overFlowEvent=]   callback function invoked when <code>maxBytes</code> exceeded
 * @return {Iterable<PersistedItem>}        An async iteration, where each item resolves to an object containing
 * @name persisted
 * @function
 * @example
import {persisted} from 'async_iter'

const items = await persisted(source, './tmp/buffering_example')

for await (const item of items) {
  console.log(item.value.toString())
  item.completed() // If this function is not called, item will be processed if iterator restarted
}
 * @memberof module:Operators
 * @name persisted
 */
export async function persisted(source, path, opts = {}) {
  opts = {
    allowRestart: false,
    maxBytes: 0,
    overFlowEvent: () => undefined,
    ...opts,

    overflow: false
  }

  const {push, stop, items, consumerHasStopped} = await open(path, opts)

  process.nextTick(async () => {
    let item = await source.next()
    try {
      while (!item.done) {
        if (consumerHasStopped())
          break

        await push(item.value)

        item = await source.next()
      }
    } catch (err) {
      source.throw(err)
    } finally {
      source.return()
      await stop()
    }
  })

  return items
}
