import {last as _last} from '../last'

export const last = (...args) => source => _last(source, ...args)
