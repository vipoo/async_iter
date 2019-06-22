
export function asAsyncIterator(source) {
  return _asAsyncIterator(source, new Error())
}

/* eslint complexity: ['error', 5] */
async function* _asAsyncIterator(source, sourceErr) {
  try {
    if (source.then)
      return yield* asAsyncIterator(await source)

    if (source.next)
      return yield* source

    for await (const item of source)
      yield item
  } catch (err) {
    err.stack = sourceErr.stack.slice(7)
    throw err
  }
}

export function syncType(sync, async) {
  return (source, ...args) => {
    if (source[Symbol.iterator])
      return sync(source, ...args)

    return async(source, ...args)
  }
}
