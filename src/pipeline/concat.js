import {concat as _concat} from '../concat'

export const concat = (...args) => source => _concat(source, ...args)
