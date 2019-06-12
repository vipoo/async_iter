import {chunk as _chunk} from '../chunk'

export const chunk = (...args) => source => _chunk(source, ...args)
