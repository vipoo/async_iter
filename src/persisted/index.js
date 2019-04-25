import {open} from './storage'

export async function persisted(source, path, opts = {}) {
  opts = {
    allowRestart: false,
    maxBytes: 0,
    ...opts,

    currentByteCount: 0
  }

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
