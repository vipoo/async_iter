import {rateLimit as _rateLimit} from '../rate_limit'

export const rateLimit = (...args) => source => _rateLimit(source, ...args)
