
export async function* map(source, fn) {
  for await (const item of source)
    yield fn(item)
}
