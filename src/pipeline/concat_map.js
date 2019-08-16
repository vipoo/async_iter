import {mergeMap as _mergeMap} from '../concat_map'

export const mergeMap = (...args) => source => _mergeMap(source, ...args)
