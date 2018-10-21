const got = require('got')
const { stringify } = require('query-string')

const { ERROR_CODE } = require('./constants')

const enhancedStringify = params => (params && Object.keys(params).length ? `?${stringify(params)}` : '')

const getJSON = (url, params) => got(`${url}${enhancedStringify(params)}`, { json: true }).then(({ body }) => body)

const getIntersection = (IDkey, ...arrays) => {
  const countBy = arrays.length
  const valuesMap = {}
  const intersection = []

  arrays.forEach(array =>
    array.forEach(value => {
      const idValue = value[IDkey]
      const initialMapValue = valuesMap[idValue]
      valuesMap[idValue] = initialMapValue ? initialMapValue + 1 : 1

      if (valuesMap[idValue] === countBy) intersection.push(idValue)
    }),
  )

  return intersection
}

const simpleMemoize = fn => {
  // how to improve: add cache lifetime
  const cache = new Map()

  return arg => {
    if (cache.has(arg)) {
      return cache.get(arg)
    }

    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

const send500 = (res, code) => res.sendStatus(ERROR_CODE)

module.exports = {
  getJSON,
  getIntersection,
  simpleMemoize,
  send500,
}
