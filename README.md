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

[API Docs](https://vipoo.github.io/async_iter/)

#### Async/Sync Iterator functions

* [bufferBy](https://vipoo.github.io/async_iter/global.html#bufferBy)
* [map](https://vipoo.github.io/async_iter/global.html#map)
* [persisted](https://vipoo.github.io/async_iter/global.html#persisted)
* [rateLimit](https://vipoo.github.io/async_iter/global.html#rateLimit)
* [take](https://vipoo.github.io/async_iter/global.html#take)

#### Itertor generators

* [fromStream](https://vipoo.github.io/async_iter/global.html#fromStream)


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

