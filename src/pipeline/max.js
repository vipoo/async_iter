import {max as _max} from '../max'

export const max = (...args) => source => _max(source, ...args)
