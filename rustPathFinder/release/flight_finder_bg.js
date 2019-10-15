
const path = require('path').join(__dirname, 'flight_finder_bg.wasm');
const bytes = require('fs').readFileSync(path);
let imports = {};
imports['./flight_finder.js'] = require('./flight_finder.js');

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
