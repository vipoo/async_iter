import {takeWhile as _takeWhile} from '../take_while'

export const takeWhile = (...args) => source => _takeWhile(source, ...args)
