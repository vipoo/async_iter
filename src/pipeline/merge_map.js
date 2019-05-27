import {mergeMap as _mergeMap} from '../merge_map'

export const mergeMap = (...args) => source => _mergeMap(source, ...args)
