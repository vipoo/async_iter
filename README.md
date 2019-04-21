# async_iter
-----------------

[![Build Status](https://travis-ci.com/vipoo/async_iter.svg?branch=master)](https://travis-ci.com/vipoo/async_iter_persited)

A set of async generators and iterator functions

## Overview

#### Async Iterator functions

* [map](#Map)
* [persisted](#Persisted)
* [take](#Take)

#### Itertor generators

* [range](#Range)

### Map
#### `items = map(source, fn)`

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**fn**: function invoked for each item in the source iteration

Returns

The transformed iteration

### Persisted
#### `{value, completed} = persisted(source, localPath)`

Persist items of an async iterator to files for later retrieval

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**localPath**: is a directory for storage of items.

Returns

**Value**: the emitted value from the persisted store -
  as a buffer (ie: you need to apply, toString())

**completed**: A function that must be called to removed the item.
> If completed not called, and iteration is restarted, then the item will be re-emitted.

```javascript

  const items = await persisted(source, './tmp/buffering_example')

  for await (const item of items) {
    console.log(item.value.toString())
    item.completed() // If not 'completed', item will be processed if items iterator restarted.
  }

```

> `Persisted` will consume items as fast as the source will emit.
The consumer of the iteration will be 'decoupled' from the source

### Take
#### `items = take(source, count)`

Re-emits the first n item of the source iteration

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**count**: the number of items to re-emit

Returns

An async iterator the will have upto *count* items.  Finishes when count items reached.

```javascript

  const items = take([1, 2, 3, 4, 5], 3)

  for await (const item of items)
    console.log(item)

```

### Range
#### `items = range({start, step, end})`

Returns an iterator that iterate from start to end (inclusive) by step amounts

**start** defaults to 0

**end** defaults to infinite or -infinite

**step** defaults to 1

