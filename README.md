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

* [broadcast](https://vipoo.github.io/async_iter/global.html#broadcast)
* [bufferBy](https://vipoo.github.io/async_iter/global.html#bufferBy)
* [bufferGroupBy](https://vipoo.github.io/async_iter/global.html#bufferGroupBy)
* [byLines](https://vipoo.github.io/async_iter/global.html#byLines)
* [chunk](https://vipoo.github.io/async_iter/global.html#chunk)
* [combineWhen](https://vipoo.github.io/async_iter/global.html#combineWhen)
* [count](https://https://vipoo.github.io/async_iter/global.html#count)
* [map](https://vipoo.github.io/async_iter/global.html#map)
* [persisted](https://vipoo.github.io/async_iter/global.html#persisted)
* [rateLimit](https://vipoo.github.io/async_iter/global.html#rateLimit)
* [take](https://vipoo.github.io/async_iter/global.html#take)

#### Itertor generators

* [fromStream](https://vipoo.github.io/async_iter/global.html#fromStream)
* [interval](https://vipoo.github.io/async_iter/global.html#interval)
* [pump](https://vipoo.github.io/async_iter/global.html#pump)
* [range](https://vipoo.github.io/async_iter/global.html#range)
