import {resolve} from 'path'
import mkdirp from 'mkdirp-promise'
import {join} from 'path'
import _fs from 'fs'
const fs = _fs.promises
import rmfr from 'rmfr'
import {pushItem, popItem, restoreUnprocessedItems, isEmpty} from './item_queue'
import {flagAsStop, hasStoppedFlag} from './stop_flaging'

function dirs(storeDirectory) {
  storeDirectory = resolve(storeDirectory)
  const readDirectory = join(storeDirectory, 'reading')
  const processingDirectory = join(storeDirectory, 'processing')
  const writingDirectory = join(storeDirectory, 'writing')

  return {readDirectory, processingDirectory, writingDirectory}
}

async function writeStopMarker(storeDirectory, readDirectory, writingDirectory) {
  await pushItem(readDirectory, writingDirectory, '')
  await flagAsStop(storeDirectory)
}

async function push(readDirectory, writingDirectory, data) {
  return pushItem(readDirectory, writingDirectory, data)
}

async function* items(readDirectory, processingDirectory, consumerStopped) {
  await restoreUnprocessedItems(readDirectory, processingDirectory)
  try {
    while (true) {
      const filename = await popItem(readDirectory, processingDirectory)

      const item = await fs.readFile(filename)
      if (item.length === 0) {
        fs.unlink(filename)
        break
      }

      yield {value: item, completed: () => fs.unlink(filename)}
    }
  } finally {
    consumerStopped()
  }
}

export async function open(storeDirectory) {
  const {readDirectory, processingDirectory, writingDirectory} = dirs(storeDirectory)

  let _consumerHasStopped = false
  const consumerHasStopped = () => _consumerHasStopped
  const consumerStopped = () => { _consumerHasStopped = true }

  if (await hasStoppedFlag(storeDirectory)) {
    if (!await isEmpty(readDirectory))
      throw new Error('Attempt to restart when a previous stopped non-empty iteration exists')

    await rmfr(storeDirectory)
  }

  await Promise.all([
    mkdirp(readDirectory),
    mkdirp(processingDirectory),
    mkdirp(writingDirectory)
  ])

  return {
    push: push(readDirectory, writingDirectory, ?),
    stop: writeStopMarker(storeDirectory, readDirectory, writingDirectory, ?),
    consumerHasStopped,
    items: items(readDirectory, processingDirectory, consumerStopped)
  }
}
