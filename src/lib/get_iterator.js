
export async function* asAsyncIterator(source) {
  if (source.then)
    return yield* asAsyncIterator(await source)

  if (source.next)
    return yield* source

  for await (const item of source)
    yield item
}

export function syncType(sync, async) {
  return (source, ...args) => {
    if (source[Symbol.iterator])
      return sync(source, ...args)

    return async(source, ...args)
  }
}
