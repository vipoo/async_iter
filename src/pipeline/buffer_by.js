import {bufferBy as _bufferBy} from '../buffer_by'

export const bufferBy = (...args) => source => _bufferBy(source, ...args)
