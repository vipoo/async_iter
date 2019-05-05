
export async function* asIterator(source) {
  for await (const item of source)
    yield item
}
/*
function* asIterator(source, marker) {
  console.log(marker, '1', source, source.next)
  if (source.next)
    return yield* source

  console.log(marker, '2', source, source.next)

  for (const item of source)
    yield item
}

*/
export async function* asAsyncIterator(source) {
  source = source.then ? await source : source
  if (source.next)
    return yield* source

  for await (const item of source)
    yield item
}

