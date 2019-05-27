import {broadcast as _broadcast} from '../broadcast'

export const broadcast = (...args) => source => _broadcast(source, ...args)
