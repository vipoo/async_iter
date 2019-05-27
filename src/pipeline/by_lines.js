import {byLines as _byLines} from '../by_lines'

export const byLines = (...args) => source => _byLines(source, ...args)
