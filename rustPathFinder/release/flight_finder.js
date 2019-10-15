let wasm;
const { TextDecoder } = require(String.raw`util`);

let WASM_VECTOR_LEN = 0;

let cachegetNodeBufferMemory = null;
function getNodeBufferMemory() {
    if (cachegetNodeBufferMemory === null || cachegetNodeBufferMemory.buffer !== wasm.memory.buffer) {
        cachegetNodeBufferMemory = Buffer.from(wasm.memory.buffer);
    }
    return cachegetNodeBufferMemory;
}

function passStringToWasm(arg) {

    const len = Buffer.byteLength(arg);
    const ptr = wasm.__wbindgen_malloc(len);
    getNodeBufferMemory().write(arg, ptr, len);
    WASM_VECTOR_LEN = len;
    return ptr;
}

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
*/
class PathFinder {

    static __wrap(ptr) {
        const obj = Object.create(PathFinder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_pathfinder_free(ptr);
    }
    /**
    * @returns {PathFinder}
    */
    static new() {
        const ret = wasm.pathfinder_new();
        return PathFinder.__wrap(ret);
    }
    /**
    * @param {string} weight
    * @returns {boolean}
    */
    hasNode(weight) {
        const ret = wasm.pathfinder_hasNode(this.ptr, passStringToWasm(weight), WASM_VECTOR_LEN);
        return ret !== 0;
    }
    /**
    * @param {string} from
    * @param {string} to
    * @param {number} distance
    */
    addLink(from, to, distance) {
        wasm.pathfinder_addLink(this.ptr, passStringToWasm(from), WASM_VECTOR_LEN, passStringToWasm(to), WASM_VECTOR_LEN, distance);
    }
    /**
    * @param {string} from_weight
    * @param {string} to_weight
    * @param {boolean} only_count_hops
    * @returns {any}
    */
    findPath(from_weight, to_weight, only_count_hops) {
        const ret = wasm.pathfinder_findPath(this.ptr, passStringToWasm(from_weight), WASM_VECTOR_LEN, passStringToWasm(to_weight), WASM_VECTOR_LEN, only_count_hops);
        return takeObject(ret);
    }
    /**
    */
    show() {
        wasm.pathfinder_show(this.ptr);
    }
}
module.exports.PathFinder = PathFinder;

module.exports.__wbindgen_json_parse = function(arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__widl_f_log_1_ = function(arg0) {
    console.log(getObject(arg0));
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm(arg0, arg1));
};
wasm = require('./flight_finder_bg');

