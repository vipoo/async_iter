
export async function* tap(source, fn) {
  for await (const item of source) {
    await fn(item)
    yield item
  }
}
