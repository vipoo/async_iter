import {concatMap as _concatMap} from '../concat_map'

export const concatMap = (...args) => source => _concatMap(source, ...args)
