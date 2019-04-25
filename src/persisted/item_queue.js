import {uuidv4} from '../lib/uuid'
import {join} from 'path'
import _fs from 'fs'
const fs = _fs.promises

const delay = period => new Promise(res => setTimeout(res, period))

export async function pushItem(readDirectory, writingDirectory, data, state) {
  if (state.maxBytes !== 0 && state.maxBytes <= state.currentByteCount)
    return // to much data - drop the packet

  const id = process.hrtime.bigint().toString().padStart(14, '0')
  const name = `${id}-${uuidv4()}`
  const filename = join(writingDirectory, name)
  data = data.toString()
  state.currentByteCount = state.currentByteCount || 0
  state.currentByteCount += data.length

  await fs.writeFile(filename, data)
  await fs.rename(filename, join(readDirectory, name))
}

export async function popItem(readDirectory, processingDirectory, state) {
  let x
  do {
    x = await fs.readdir(readDirectory)
    if ( x.length === 0)
      delay(100)

  } while (x.length === 0)

  const name = x.sort()[0]
  const filename = join(processingDirectory, name)
  await fs.rename(join(readDirectory, name), filename)
  const data = await fs.readFile(filename)
  state.currentByteCount -= data.length
  return {filename, item: data}
}

export async function removeLast(readDirectory) {
  const x = await fs.readdir(readDirectory)
  if (x.length === 0)
    return

  const name = x.sort()[x.length - 1]
  const filename = join(readDirectory, name)
  const item = await fs.readFile(filename)
  if (item.length === 0)
    await fs.unlink(filename)
}

export async function restoreUnprocessedItems(readDirectory, processingDirectory) {
  const x = await fs.readdir(processingDirectory)
  for (const f of x)
    await fs.rename(join(processingDirectory, f), join(readDirectory, f))
}

export async function isEmpty(readDirectory) {
  return await fs.readdir(readDirectory)
    .then(x => x.length === 0)
    .catch(() => true)
}
