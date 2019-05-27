import {combineWhen as _combineWhen} from '../combine_when'

export const combineWhen = (...args) => source => _combineWhen(source, ...args)
