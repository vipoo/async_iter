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

* [createLatch](#CreateLatch)
* [range](#Range)

### Map
#### `items = map(source, fn)`

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**fn**: function invoked for each item in the source iteration

Returns

The transformed iteration

### Persisted
#### `{value, completed} = await persisted(source, localPath)`

Persist items of an async iterator to files for later retrieval

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**localPath**: is a directory for storage of items.

Returns

A promise that resolves to an object containing:

**Value**: the emitted value from the persisted store -
  as a buffer (ie: you need to apply, toString())

**completed**: A function that must be called to removed the item.
> If completed not called, and iteration is restarted, then the item will be re-emitted.

```javascript
  import {persisted} from 'async_iter'

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
  import {take} from 'async_iter'

  const items = take([1, 2, 3, 4, 5], 3)

  for await (const item of items)
    console.log(item)

```

## CreateLatch
#### {push, abort, stop, items, hasStoppedConsuming} = await createLatch()

createLatch allows for the async 'pushing' of values to an async iteration

The `push` operation returns a promise, that resolves when the iteration has consumed the item

This iterator is similiar to Observable (rxjs), in that it supports a kind
of push value to consumer, as events happen in your application.

But it only supports one consumer per one producer.
And the 'pushing' of values can be blocked, until the consumer has consumed the value

If the code pushing values, does not await the return promise, the values are then queued
for processing by the consumer.

```javascript

  import {createLatch} from 'async_iter'

  // Create a push based iteration set
  const {push, abort, stop, items} = await createLatch()

  //Set up a background task to consume the items
  setTimeout(async () => {
    for await (const item of items())
      console.log(item)
  }, 0)

  //Values can be push to the iteration
  await push(1) // if you dont 'await' the values will be queued.
  await push(2)
  await push(3)
  await stop()

  // If you want to push an 'error' to the consumer
  await abort(new Error('My error'))

```


### Range
#### `items = range({start, step, end})`

Returns an iterator that iterate from start to end (inclusive) by step amounts

**start** defaults to 0

**end** defaults to infinite or -infinite

**step** defaults to 1

