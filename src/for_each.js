
export async function forEach(source, fn) {
  source = await source

  for await (const item of source)
    await fn(item)
}
