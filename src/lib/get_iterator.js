
export async function* asIterator(source) {
  for await (const item of source)
    yield item
}
