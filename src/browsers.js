//polyfill hrtime
import hrtime from 'browser-process-hrtime'
if (!process.hrtime)
  process.hrtime = hrtime

export * from './buffer_by'
export * from './interval'
export * from './rate_limit'
export * from './pump'
export * from './take'
