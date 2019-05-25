import {asAsyncIterator, syncType} from './lib/get_iterator'

export const min = syncType(syncMin, asyncMin)

function syncMinBy(source, fn) {
  let currentMin
  let currentItem

  for (const item of source)
    if (currentItem === undefined) {
      currentItem = item
      currentMin = fn(item)
    } else {
      const m = fn(item)
      if (currentMin > m) {
        currentMin = m
        currentItem = item
      }
    }

  return currentItem
}

function syncMinByComp(source, fn) {
  let currentItem

  for (const item of source)
    if (currentItem === undefined)
      currentItem = item
    else if (fn(item, currentItem) < 0)
      currentItem = item

  return currentItem
}

function syncMinValue(source) {
  let currentItem

  for (const item of source)
    if (currentItem === undefined)
      currentItem = item
    else
    if (currentItem > item)
      currentItem = item

  return currentItem
}

async function asyncMinBy(source, fn) {
  let currentMin
  let currentItem

  for await (const item of source)
    if (currentItem === undefined) {
      currentItem = item
      currentMin = await fn(item)
    } else {
      const m = await fn(item)
      if (currentMin > m) {
        currentMin = m
        currentItem = item
      }
    }

  return currentItem
}

async function asyncMinByComp(source, fn) {
  let currentItem

  for await (const item of source)
    if (currentItem === undefined)
      currentItem = item
    else if (await fn(item, currentItem) < 0)
      currentItem = item

  return currentItem
}

function syncMin(source, fn) {
  if (!fn)
    return syncMinValue(source)

  if (fn.length >= 2)
    return syncMinByComp(source, fn)

  return syncMinBy(source, fn)
}

async function asyncMinValue(source) {
  let currentItem

  for await (const item of source)
    if (currentItem === undefined)
      currentItem = item
    else
    if (currentItem > item)
      currentItem = item

  return currentItem
}

async function asyncMin(source, fn) {
  source = await asAsyncIterator(source)

  if (!fn)
    return asyncMinValue(source)

  if (fn.length >= 2)
    return asyncMinByComp(source, fn)

  return asyncMinBy(source, fn)
}
