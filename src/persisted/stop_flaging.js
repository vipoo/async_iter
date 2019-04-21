import {join} from 'path'
import _fs from 'fs'
const fs = _fs.promises

export async function flagAsStop(storeDirectory) {
  await fs.writeFile(join(storeDirectory, 'stopped'), '')
}

export async function hasStoppedFlag(storeDirectory) {
  return await fs
    .access(join(storeDirectory, 'stopped'), _fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
