import {open} from './storage'

export async function persisted(source, path) {
  const {push, stop, items, consumerHasStopped} = await open(path)

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
