import {asAsyncIterator, syncType} from './lib/get_iterator'

export const byLines = syncType(syncByLines, asyncByLines)

function getPotentialLines() {
  const fn = item => {
    const potentialLines = item.split('\n')
    potentialLines[0] = fn.currentLine ? `${fn.currentLine}${potentialLines[0]}` : potentialLines[0]

    fn.currentLine = potentialLines.pop()
    if (fn.currentLine === '\n')
      fn.currentLine = undefined

    return potentialLines
  }

  fn.currentLine = undefined
  return fn
}

function* syncByLines(source, fn) {
  const potentialLinesFrom = getPotentialLines()

  for (const item of source)
    for (const potentialLine of potentialLinesFrom(item))
      yield potentialLine

  if (potentialLinesFrom.currentLine !== undefined)
    yield potentialLinesFrom.currentLine
}

async function* asyncByLines(source, fn) {
  source = await asAsyncIterator(source)

  const potentialLinesFrom = getPotentialLines()

  for await (const item of source)
    for (const potentialLine of potentialLinesFrom(item))
      yield potentialLine

  if (potentialLinesFrom.currentLine !== undefined)
    yield potentialLinesFrom.currentLine
}
