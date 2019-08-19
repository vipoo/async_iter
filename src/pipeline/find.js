import {find as _find} from '../find'

export const find = (...args) => source => _find(source, ...args)
