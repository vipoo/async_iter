import {toArray as _toArray} from '../to_array'

export const toArray = (...args) => source => _toArray(source, ...args)
