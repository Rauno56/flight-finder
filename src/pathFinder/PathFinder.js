const assert = require('assert');
const path = require('ngraph.path');
const createGraph = require('ngraph.graph');

const { PathFinderResult, Route } = require('../types.js');
const { assertAllOfType } = require('../utils.js');
const isIdNotDefinedInGraphError = (error) => {
	return /is not defined in this graph/.test(error.message);
};

class PathFinder {
	constructor(routes) {
		assertAllOfType(routes, Route);

		const graph = this._graph = createGraph();
		routes.forEach((i) => {
			graph.addLink(i.from, i.to, i);
		});

		this._pathFinder = path.aStar(graph, {
			oriented: true,
		});
		this._distancePathFinder = path.aStar(graph, {
			oriented: true,
			distance(fromNode, toNode, link) {
				return link.data.distance;
			}
		});
	}

	safeFind(finder, fromId, toId) {
		/*
			ngraph.path throws if no node with id. We have "node" DB separate from
			routes outside of this scope here. We want to behave the same if missing
			node or no route.
		*/
		try {
			return finder.find(fromId, toId);
		} catch (e) {
			if (isIdNotDefinedInGraphError(e)) {
				return [];
			}
			throw e;
		}
	}

	find(fromId, toId) {
		assert.strictEqual(typeof fromId, 'string');
		assert.strictEqual(typeof toId, 'string');

		const leastDistance = this.safeFind(this._distancePathFinder, fromId, toId);

		// ngraph.path returns empty array if no path.
		if (leastDistance.length === 0) {
			return PathFinderResult.NO_PATH;
		}
		if (leastDistance.length <= 5) {
			// ngraph.path returns nodes in reverse order
			return leastDistance.map((i) => i.id).reverse();
		}

		/*
			Finding the shortest distance path in 4 legs or less is actually not
			implemented yet - if we were not lucky enough to have found the most
			optimal solution at least let the user know that we don't know.
		*/
		const leastHops = this.safeFind(this._pathFinder, fromId, toId);

		if (leastHops.length <= 5) {
			return PathFinderResult.NA;
		}

		return PathFinderResult.TOO_LONG;
	}
}

module.exports = PathFinder;
