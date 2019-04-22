
function* forwardRange({start, end = Infinity, step}) {
  for (let i = start; i <= end; i += step) {
    console.log('??', i)
    yield i
  }
}

function* reverseRange({start, end = -Infinity, step}) {
  for (let i = start; i >= end; i += step)
    yield i
}

/* eslint complexity: ['error', 7] */
export function range(opts) {
  if (typeof opts === 'number')
    opts = {end: opts}

  opts = {start: 0, ...opts}

  if (!opts.end && !opts.step)
    opts.end = Infinity

  if (!opts.step)
    opts.step = opts.start < opts.end ? 1 : -1

  return opts.step > 0 ? forwardRange(opts) : reverseRange(opts)
}

