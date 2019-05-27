import {takeUntil as _takeUntil} from '../take_until'

export const takeUntil = (...args) => source => _takeUntil(source, ...args)
