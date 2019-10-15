#!/usr/bin/env sh

cd "`dirname $0`"
wasm-pack build --target nodejs
