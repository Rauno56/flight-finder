const assert = require('assert');
const types = require('./types.js');

const mod = module.exports = require('./PathFinder/JsPathFinder.js');

const finderMap = {};
finderMap[types.PathFinderType.JS] = './PathFinder/JsPathFinder.js';
finderMap[types.PathFinderType.RUST] = './PathFinder/WasmPathFinder.js';

mod.forceLoadModule = (finderType) => {
	const modulePath = finderMap[finderType];


	assert.strictEqual(typeof modulePath, 'string', `No such pathfinder: ${finderType.toString()}`);

	console.log('Pathfinder', finderType.description);
	return require(modulePath);
};
