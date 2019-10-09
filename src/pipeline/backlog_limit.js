import {backlogLimit as _backlogLimit} from '../backlog_limit'

export const backlogLimit = (...args) => source => _backlogLimit(source, ...args)
