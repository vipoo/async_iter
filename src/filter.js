
export async function* filter(source, fn) {
  for await (const x of source)
    if (await fn(x))
      yield x
}
