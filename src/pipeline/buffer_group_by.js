import {bufferGroupBy as _bufferGroupBy} from '../buffer_group_by'

export const bufferGroupBy = (...args) => source => _bufferGroupBy(source, ...args)
