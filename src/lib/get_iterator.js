
export function getIterator(source) {
  if (source[Symbol.iterator])
    return source[Symbol.iterator]()

  if (source[Symbol.asyncIterator])
    return source[Symbol.asyncIterator]()

  throw new TypeError('source is not an iterable')
}
