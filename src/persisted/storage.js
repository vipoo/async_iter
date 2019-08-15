import {resolve} from 'path'
import {join} from 'path'
import fs from 'fs'
const fsp = fs.promises
import {pushItem, popItem, removeLast, restoreUnprocessedItems, isEmpty} from './item_queue'
import {flagAsStop, unflagAsStop, hasStoppedFlag} from './stop_flaging'

function dirs(storeDirectory) {
  storeDirectory = resolve(storeDirectory)
  const readDirectory = join(storeDirectory, 'reading')
  const processingDirectory = join(storeDirectory, 'processing')
  const writingDirectory = join(storeDirectory, 'writing')

  return {readDirectory, processingDirectory, writingDirectory}
}

async function writeStopMarker(storeDirectory, readDirectory, writingDirectory, opts) {
  await pushItem(readDirectory, writingDirectory, '', {...opts, maxBytes: 0})
  await flagAsStop(storeDirectory)
}

async function push(readDirectory, writingDirectory, opts, data) {
  return pushItem(readDirectory, writingDirectory, data, opts)
}

async function* getItems(readDirectory, processingDirectory, consumerStopped, opts) {
  try {
    while (true) {
      const {filename, item} = await popItem(readDirectory, processingDirectory, opts)

      if (item.length === 0) {
        await fsp.unlink(filename)
        break
      }

      yield {value: item, completed: () => fsp.unlink(filename)}
    }
  } finally {
    consumerStopped()
  }
}

export async function open(storeDirectory, opts) {
  const {readDirectory, processingDirectory, writingDirectory} = dirs(storeDirectory)

  let _consumerHasStopped = false
  const consumerHasStopped = () => _consumerHasStopped
  const consumerStopped = () => { _consumerHasStopped = true }

  await Promise.all([
    fsp.mkdir(readDirectory, {recursive: true}),
    fsp.mkdir(processingDirectory, {recursive: true}),
    fsp.mkdir(writingDirectory, {recursive: true})
  ])

  await restoreUnprocessedItems(readDirectory, processingDirectory, opts)
  const items = getItems(readDirectory, processingDirectory, consumerStopped, opts)

  if (await hasStoppedFlag(storeDirectory))
    if (!await isEmpty(readDirectory)) {
      if (!opts.allowRestart)
        throw new Error('Attempt to restart when a previous stopped non-empty iteration exists')

      await unflagAsStop(storeDirectory)
      await removeLast(readDirectory)
    }

  return {
    push: data => push(readDirectory, writingDirectory, opts, data),
    stop: () => writeStopMarker(storeDirectory, readDirectory, writingDirectory, opts),
    consumerHasStopped,
    items
  }
}
