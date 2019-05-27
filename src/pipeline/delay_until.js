import {delayUntil as _delayUntil} from '../delay_until'

export const delayUntil = (...args) => source => _delayUntil(source, ...args)
