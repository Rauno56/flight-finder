const assert = require('assert');
const databaseUtils = require('../src/pathFinder/databaseUtils.js');
const apiGenerator = require('../src/api.js');

describe('api', () => {
	it('should require input', () => {
		const database = databaseUtils.load({
			airports: [],
			routes: [
				{ from: '1', to: '2', distance: 1 }
			],
		});

		const api = apiGenerator(database);

		assert.throws(() => {
			api.find();
		}, /from_.* required/);
	});

	it('should work on happy path', () => {
		const database = databaseUtils.load({
			airports: [
				{ iata: 'aA', icao: 'cA', id: '1', name: 'Airport A', lat: 1, lng: 1 },
				{ iata: 'aB', icao: 'cB', id: '2', name: 'Airport B', lat: 1, lng: 1 },
			],
			routes: [
				{ from: '1', to: '2', distance: 1 }
			],
		});

		const api = apiGenerator(database);

		const result = api.find({
			from_iata: database.airports[0].iata,
			to_icao: database.airports[1].icao,
		});

		assert.deepEqual(result, {
			from: database.airports[0],
			to: database.airports[1],
			route: {
				success: true,
				stops: [
					database.airports[0],
					database.airports[1],
				],
			},
		});
	});

	it('should have limit to the length of the route', () => {
		const database = databaseUtils.load({
			airports: [
				{ iata: 'aA', icao: 'cA', id: '1', name: 'Airport A', lat: 1, lng: 1 },
				{ iata: 'aB', icao: 'cB', id: '5', name: 'Airport B', lat: 1, lng: 1 },
				{ iata: 'aC', icao: 'cC', id: '6', name: 'Airport C', lat: 1, lng: 1 },
			],
			routes: [
				{ from: '1', to: '2', distance: 1 },
				{ from: '2', to: '3', distance: 1 },
				{ from: '3', to: '4', distance: 1 },
				{ from: '4', to: '5', distance: 1 },
				{ from: '5', to: '6', distance: 1 },
			],
		});


		const api = apiGenerator(database);

		const result = api.find({
			from_iata: database.airports[0].iata,
			to_icao: database.airports[2].icao,
		});

		assert.deepEqual(result, {
			from: database.airports[0],
			to: database.airports[2],
			route: {
				success: false,
				message: 'Path between provided airports too long'
			},
		});

		const longestValidResult = api.find({
			from_iata: database.airports[0].iata,
			to_icao: database.airports[1].icao,
		});

		assert.deepEqual(longestValidResult, {
			from: database.airports[0],
			to: database.airports[1],
			route: {
				success: true,
				stops: [
					database.airports[0],
					{ name: 'Unknown Airport', id: 2 },
					{ name: 'Unknown Airport', id: 3 },
					{ name: 'Unknown Airport', id: 4 },
					database.airports[1],
				],
			},
		});
	});

	it('should know when our algorithm fails', () => {
		const database = databaseUtils.load({
			airports: [
				{ iata: 'aA', icao: 'cA', id: '1', name: 'Airport A', lat: 1, lng: 1 },
				{ iata: 'aB', icao: 'cB', id: '5', name: 'Airport B', lat: 1, lng: 1 },
				{ iata: 'aC', icao: 'cC', id: '6', name: 'Airport C', lat: 1, lng: 1 },
			],
			routes: [
				{ from: '1', to: '2', distance: 1 },
				{ from: '2', to: '3', distance: 1 },
				{ from: '3', to: '4', distance: 1 },
				{ from: '4', to: '5', distance: 1 },
				{ from: '5', to: '6', distance: 1 },
				{ from: '1', to: '6', distance: 10 },
			],
		});

		const api = apiGenerator(database);

		const result = api.find({
			from_iata: database.airports[0].iata,
			to_icao: database.airports[2].icao,
		});

		assert.deepEqual(result, {
			from: database.airports[0],
			to: database.airports[2],
			route: {
				success: false,
				message: 'Do not know the best route'
			},
		});
	});
});
