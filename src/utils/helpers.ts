import { stringify } from 'query-string'
import { always } from 'ramda'

export const noop = always(undefined)

export const enhancedStringify = params => (params && Object.keys(params).length ? `?${stringify(params)}` : '')
