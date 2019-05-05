
export async function toArray(source) {
  source = source.then ? (await source) : source
  const result = []
  for await (const item of source)
    result.push(item)

  return result
}
