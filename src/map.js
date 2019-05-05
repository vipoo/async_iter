
export async function* map(source, fn) {
  source = source.then ? (await source) : source
  for await (const item of source)
    yield fn(item)
}
