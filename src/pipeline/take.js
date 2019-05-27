import {take as _take} from '../take'

export const take = (...args) => source => _take(source, ...args)
