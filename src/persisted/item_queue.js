import {uuidv4} from '../lib/uuid'
import {join} from 'path'
import _fs from 'fs'
const fs = _fs.promises

const delay = period => new Promise(res => setTimeout(res, period))

export async function pushItem(readDirectory, writingDirectory, data) {
  const name = `${process.hrtime.bigint()}-${uuidv4()}`
  const filename = join(writingDirectory, name)
  await fs.writeFile(filename, data)
  await fs.rename(filename, join(readDirectory, name))
}

export async function popItem(readDirectory, processingDirectory) {
  let x
  do {
    x = await fs.readdir(readDirectory)
    if ( x.length === 0)
      delay(100)

  } while (x.length === 0)

  const name = x.sort()[0]
  const filename = join(processingDirectory, name)
  await fs.rename(join(readDirectory, name), filename)
  return filename
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
