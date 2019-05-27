import {delay as _delay} from '../delay'

export const delay = (...args) => source => _delay(source, ...args)
