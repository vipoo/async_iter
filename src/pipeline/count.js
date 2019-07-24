import {count as _count} from '../count'

export const count = (...args) => source => _count(source, ...args)
