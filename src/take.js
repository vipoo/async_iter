
export async function* take(source, count) {
  for await (const x of source) {
    yield x
    if (count-- <= 1)
      break
  }
}
