import {filterWhen as _filterWhen} from '../filter_when'

export const filterWhen = (...args) => source => _filterWhen(source, ...args)
