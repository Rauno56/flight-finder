const assert = require('assert');
const { PathFinder: WasmPathFinder } = require('../../rustPathFinder/pkg');

const { PathFinderResult, Route } = require('../types.js');
const { assertAllOfType } = require('../utils.js');

class PathFinder {
	constructor(routes) {
		assertAllOfType(routes, Route);

		const graph = this._graph = WasmPathFinder.new();
		routes.forEach((i) => {
			graph.addLink(i.from, i.to, i.distance);
		});
	}

	find(fromId, toId) {
		assert.strictEqual(typeof fromId, 'string');
		assert.strictEqual(typeof toId, 'string');

		const result = this._graph.findPath(fromId, toId, false);
		if (result === null) {
			return PathFinderResult.NO_PATH;
		}
		const { /*cost: distance,*/ path: leastDistance } = this._graph.findPath(fromId, toId, false);

		// ngraph.path returns empty array if no path.
		if (leastDistance.length === 0) {
			return PathFinderResult.NO_PATH;
		}
		if (leastDistance.length <= 5) {
			// ngraph.path returns nodes in reverse order
			return leastDistance;
		}

		/*
			Finding the shortest distance path in 4 legs or less is actually not
			implemented yet - if we were not lucky enough to have found the most
			optimal solution at least let the user know that we don't know.
		*/
		const { /*cost: hops,*/ path: leastHops } = this._graph.findPath(fromId, toId, true);

		if (leastHops.length <= 5) {
			return PathFinderResult.NA;
		}

		return PathFinderResult.TOO_LONG;
	}
}

module.exports = PathFinder;
