import {forEach as _forEach} from '../for_each'

export const forEach = (...args) => source => _forEach(source, ...args)
