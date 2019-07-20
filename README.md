# async_iter
-----------------

[![Build Status](https://travis-ci.com/vipoo/async_iter.svg?branch=master)](https://travis-ci.com/vipoo/async_iter_persited)

A set of async generators and iterator functions

This project is me just experimenting and learning about async generators in javascript.

Its not supported or stable.

### Installing

`npm install async_iter`

## Overview

Below are the listed generators and functions implemented in this module.

Have a look at the [examples directory](https://github.com/vipoo/async_iter/tree/master/src/examples) for working examples

The module uses babel to target nodejs version 10.15.3.  It should be compatibile
with node 10 and above.

#### Async Iterator functions

* [bufferBy](#bufferby)
* [map](#map)
* [persisted](#persisted)
* [rateLimit](#ratelimit)
* [take](#take)

#### Itertor generators

* [broadcast](#broadcast)
* [pump](#pump)
* [interval](#interval)
* [range](#range)
* [fromStream](#fromstream)

### BufferBy
#### `items = bufferBy(source, triggerFn, maxWaitTime)`

Collect a set of items from source.  Emit as an array of those items.

The batch is produced, when the `triggerFn` returns true, or the `maxWaitTime` has elasped since the last emitted value

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**triggerFn(value, currentBatch)**: called for each item in the source iteration.  Return true to trigger a batch

**value** - the value of the current source item
**currentBatch** - the current array of collected items - the last item will be `value`

**maxWaitTime** - period is milliseconds to trigger a batch, if no batch has been emitted and there are pending values


### Map
#### `items = map(source, fn)`

Transforms each item in the supplied iteration using the supplied function

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**fn**: function invoked for each item in the source iteration

Returns

The transformed iteration

### Persisted
#### `items = await persisted(source, localPath, opts)`

Persist items of an async iterator to files for later retrieval

> if a previously iteration was persisted and completed, you can not start a
> new iteration unless you set the `allowRetart` to true

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**localPath**: is a directory for storage of items.

**opts**: a set of optional flags:

**allowRestart**: (default false) - allows a restart of a previously completed iteration

**maxBytes**: (default 0) - limits the number of bytes that can be stored. Zero indicates no limit.

**overFlowEvent**: (optional) - callback function invoked when `maxBytes` exceeded.  The value
returned from this callback will be emitted into the iteration, unless `underfined` is returned.

Returns

An async iteration, where each item resolves to an object containing:

**Value**: the emitted value from the persisted store -
  as a buffer (ie: you need to apply, toString())

**completed**: A function that must be called to removed the item.
> If completed not called, and iteration is restarted, then the item will be re-emitted.

Example:

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

### RateLimit
#### `items = rateLimit(source, maxAmount, perPeriod, counterFn)`

Emits the values from the source iteration at upto a limited rate


**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**maxAmount** the maxmimum number of units to be emitted within the time of `perPeriod`
> Units may be emitted elements or a customed defined concept

**perPeriod** the period in milliseconds to be applied

**counterFn(item)** an optional callback function, called for each item.  It needs to
return the number of unit cost for the item

Defaults to 1 per emitted item

> The source iteration will be consumed only as required - there is no queing within rateLimit function

Example:

```javascript
  import {rateLimit} from 'async_iter'

  // Emit at no more than 5 characters per 2s
  const items = ['first', 'second', 'third', 'fourth', 'fifth']
    |> rateLimit(?, 5, 2000, v => v.toString().length)

```


### Take
#### `items = take(source, count)`

Re-emits the first n item of the source iteration

**source**: is the source iteration (`Symbol.iterator` or `Symbol.asyncIterator`)

**count**: the number of items to re-emit

Returns

An async iterator the will have upto *count* items.  Finishes when count items reached.

Example:

```javascript
  import {take} from 'async_iter'

  const items = take([1, 2, 3, 4, 5], 3)

  for await (const item of items)
    console.log(item)

```
### Broadcast
#### itemsGeneratorFunction = await broadcast(source)

Returns a generator function that will subscribe to the source iteration.

Each generator function, will iterate over the same source values.

> No queing of values, so each consumer will be made to wait for all other consumers.

> The source iteration is not started, until at least one subscription has started consuming.

> The source iteration is paused, if all consumers are stopped.  Any new subscriptions will continue from where the source iteraion was iterated to.

**Returns** - a generator function to create an iterable of the source items.

**Returns.return** - Close all consumer iterators and close the source iteration.

## Pump
#### items = await pump(callBack)

pump allows for the 'pushing' of values into an async iterator consumer

The `push` operation returns a promise, that resolves when the consuming iteration has consumed the item

This function follows the convention of a pushed iterator interface (next, throw, return).

If the code pushing values, does not await the return promise, the values are then queued
for processing by the consumer as it pulls in the values

**callBack** - this is a function that will pump values into the interator.

> See below for the callback signature and parameters description.
> The callback is not invoked, until the first item is pulled from the iteration.

**Returns** - A standard async iterator that can consume the generated values

The callback takes 2 arguments: (`target` and `hasStopped`):

**callBack: target** - this is a async generator prototype with the 3 functions:

**target.next** - call this function to push a value into the iteration - returns a promise when the consumer
has consumed this item.  Returns a promise that resolves to `{value, done}`

`done` will be true when the consumer has stopped
`value` will be an incrementing integer

**target.return** - call this function when there are no more items to be pushed.  Signal to consumer that
the iteration has completed.

**target.abort** - call this function when an error has been generated - raises the error within the consuming
iteration.

**callback: hasStopped** - a promise that resolves, when the consumer has stopped iterating.  This is an alternative
mechanism to identify a stopped iteration.

**hasStopped.now()** - function that returns true, when the consumer has stopped iterating.  This is an alternative
mechanism to identify a stopped iteration.

Example:

```javascript

  import {pump} from 'async_iter'

  // Create a push based iteration set
  const items = await pump(target => {
    //Values can be push to the iteration
    await target.next(1) // if you dont 'await' the values will be queued.
    await target.next(2)
    await target.next(3)
    // If you want to push an 'error' to the consumer
    // await target.throw(new Error('This is an error'))
    await target.return()
  })

  for await (const item of items)
    console.log(item)

```

### Interval
#### `items = await interval(period)`

Returns an async iterator the will emit every 'period' milliseconds

**period** the time in milliseconds the iterator emits

> The iterator will block its emitted values, until the consumer has consumed each item.
> Therefore there is no racing of producer to consumer.

> The iteration stops, when the consumer breaks or stop the iteration


### Range
#### `items = range({start, step, end})`

Returns an iterator that iterate from start to end (inclusive) by step amounts

**start** defaults to 0

**end** defaults to infinite or -infinite

**step** defaults to 1

### FromStream
#### `items = fromStream(eventSource, dataEvent = 'data', closeEvent = 'close')`

Returns an iterator, that emits as per the `dataEvent` of the `eventSource`

**eventSource** An object that supports the 'on' and 'removeListener' function

**dataEvent** the main dataEvent name to listen to

**closeEvent** when this event emits, the iteration is stopped

