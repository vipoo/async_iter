import {map as _map} from '../map'

export const map = (...args) => source => _map(source, ...args)
