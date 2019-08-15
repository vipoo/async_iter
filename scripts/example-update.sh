#!/usr/bin/env bash

set -e

mkdir -p ./tests/integration/$1
babel-node ./src/examples/$1/example_$2.js > ./tests/integration/$1/example_$2.txt
