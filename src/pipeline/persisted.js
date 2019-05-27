import {persisted as _persisted} from '../persisted'

export const persisted = (...args) => source => _persisted(source, ...args)
