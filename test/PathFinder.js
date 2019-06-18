const assert = require('assert');
const databaseUtils = require('../src/database/databaseUtils.js');
const PathFinder = require('../src/PathFinder.js');
const { PathFinderResult } = require('../src/types.js');

describe('PathFinder', () => {
	it('should work on happy path', () => {
		const database = databaseUtils.load({
			airports: [],
			routes: [
				{ from: '1', to: '2', distance: 1 }
			],
		});

		const pathFinder = new PathFinder(database.routes);

		const result = pathFinder.find('1', '2');

		assert(Array.isArray(result));
		assert.strictEqual(result.length, 2);
		assert.deepEqual(result, ['1', '2']);
	});

	it('should be directional', () => {
		const database = databaseUtils.load({
			airports: [],
			routes: [
				{ from: '2', to: '1', distance: 1 }
			],
		});

		const pathFinder = new PathFinder(database.routes);

		const result = pathFinder.find('1', '2');

		assert.strictEqual(result, PathFinderResult.NO_PATH);
	});

	it('should have limit to the length of the route', () => {
		const database = databaseUtils.load({
			airports: [],
			routes: [
				{ from: '1', to: '2', distance: 1 },
				{ from: '2', to: '3', distance: 1 },
				{ from: '3', to: '4', distance: 1 },
				{ from: '4', to: '5', distance: 1 },
				{ from: '5', to: '6', distance: 1 },
			],
		});

		const pathFinder = new PathFinder(database.routes);

		const result = pathFinder.find('1', '6');
		assert.strictEqual(result, PathFinderResult.TOO_LONG);

		const longestResult = pathFinder.find('1', '5');
		assert(Array.isArray(longestResult));
		assert.strictEqual(longestResult.length, 5);
	});

	it('should know when our algorithm fails', () => {
		const database = databaseUtils.load({
			airports: [],
			routes: [
				{ from: '1', to: '2', distance: 1 },
				{ from: '2', to: '3', distance: 1 },
				{ from: '3', to: '4', distance: 1 },
				{ from: '4', to: '5', distance: 1 },
				{ from: '5', to: '6', distance: 1 },
				{ from: '1', to: '6', distance: 10 },
			],
		});

		const pathFinder = new PathFinder(database.routes);

		const result = pathFinder.find('1', '6');
		assert.strictEqual(result, PathFinderResult.NA);
	});
});
