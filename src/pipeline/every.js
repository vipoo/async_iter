import {every as _every} from '../every'

export const every = (...args) => source => _every(source, ...args)
