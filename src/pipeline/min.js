import {min as _min} from '../min'

export const min = (...args) => source => _min(source, ...args)
