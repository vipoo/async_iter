import {filter as _filter} from '../filter'

export const filter = (...args) => source => _filter(source, ...args)
