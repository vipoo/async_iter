import {asAsyncIterator, syncType} from './lib/get_iterator'

/**
```
import {map} from 'async_iter/pipeline/by_lines' # pipeline version
import {map} from 'async_iter/by_lines' # conventional version
```
Take a source iterations of strings, and split and emit based on the newline character
> Supports both **sync** and **async** iterations

This operator can be used to re-contructs a set of lines that have been piped thru streams.

 * @param  {Iterable}         source        The source iteration to process
 * @return {Iterable} The transformed items
 * @function
 * @name byLines
 * @memberof module:Operators
 */

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

function* syncByLines(source) {
  const potentialLinesFrom = getPotentialLines()

  for (const item of source)
    for (const potentialLine of potentialLinesFrom(item))
      yield potentialLine

  if (potentialLinesFrom.currentLine !== undefined)
    yield potentialLinesFrom.currentLine
}

async function* asyncByLines(source) {
  source = await asAsyncIterator(source)

  const potentialLinesFrom = getPotentialLines()

  for await (const item of source)
    for (const potentialLine of potentialLinesFrom(item))
      yield potentialLine

  if (potentialLinesFrom.currentLine !== undefined)
    yield potentialLinesFrom.currentLine
}
