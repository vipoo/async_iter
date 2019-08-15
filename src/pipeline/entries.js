import {entries as _entries} from '../entries'

export const entries = (...args) => source => _entries(source, ...args)
