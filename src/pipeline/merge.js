import {merge as _merge} from '../merge'

export const merge = (...args) => source => _merge(source, ...args)
