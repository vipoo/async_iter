
export async function* asAsyncIterator(source) {
  source = source.then ? await source : source
  if (source.next)
    return yield* source

  for await (const item of source)
    yield item
}
