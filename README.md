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

* [broadcast](https://vipoo.github.io/async_iter/module-Operators.html#.broadcast)
* [bufferBy](https://vipoo.github.io/async_iter/module-Operators.html#.bufferBy)
* [bufferGroupBy](https://vipoo.github.io/async_iter/module-Operators.html#.bufferGroupBy)
* [byLines](https://vipoo.github.io/async_iter/module-Operators.html#.byLines)
* [chunk](https://vipoo.github.io/async_iter/module-Operators.html#.chunk)
* [combineWhen](https://vipoo.github.io/async_iter/module-Operators.html#.combineWhen)
* [count](https://https://vipoo.github.io/async_iter/module-Operators.html#.count)
* [map](https://vipoo.github.io/async_iter/module-Operators.html#.map)
* [persisted](https://vipoo.github.io/async_iter/module-Operators.html#.persisted)
* [rateLimit](https://vipoo.github.io/async_iter/module-Operators.html#.rateLimit)
* [take](https://vipoo.github.io/async_iter/module-Operators.html#.take)

#### Itertor generators

file:///home/dean/personal/async_iter/docs/module-Generators.html#.fromStream
* [fromStream](https://vipoo.github.io/async_iter/module-Generators.html#.fromStream)
* [interval](https://vipoo.github.io/async_iter/module-Generators.html#.interval)
* [pump](https://vipoo.github.io/async_iter/module-Generators.html#.pump)
* [range](https://vipoo.github.io/async_iter/module-Generators.html#.range)
