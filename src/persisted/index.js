import {open} from './storage'

export async function persisted(source, path, opts = {}) {
  opts = {allowRestart: false, ...opts}

  const {push, stop, items, consumerHasStopped} = await open(path, opts)

  setTimeout(async () => {
    for await (const item of source) {
      if (consumerHasStopped())
        break

      await push(item)
    }
    await stop()
  }, 0)

  return items
}
