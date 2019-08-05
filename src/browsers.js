//polyfill hrtime
import hrtime from 'browser-process-hrtime'
if (!process.hrtime)
  process.hrtime = hrtime

export * from './rate_limit'
export * from './pump'
