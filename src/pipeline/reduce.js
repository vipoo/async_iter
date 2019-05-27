import {reduce as _reduce} from '../reduce'

export const reduce = (...args) => source => _reduce(source, ...args)
