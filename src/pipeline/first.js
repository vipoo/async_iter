import {first as _first} from '../first'

export const first = (...args) => source => _first(source, ...args)
