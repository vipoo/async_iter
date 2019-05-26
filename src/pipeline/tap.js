import {tap as _tap} from '../tap'

export const tap = (...args) => source => _tap(source, ...args)
