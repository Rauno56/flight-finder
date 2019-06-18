const assert = require('assert');
const database = require('./pathFinder/databaseUtils.js').loadFile('../../res.json');
const PathFinder = require('./pathFinder/PathFinder.js');
const getAirport = require('./airportCacheGenerator.js')(database.airports);
const pathFinder = new PathFinder(database);
const { PathFinderResult, InputType } = require('./types.js');

class UserError extends Error {}

const parseInput = (iata, icao, type) => {
	assert.strictEqual(typeof type, 'string');

	if (iata && icao) {
		throw new UserError(`Please provide either ${type}_iata or ${type}_icao`);
	}
	if (iata) {
		assert(
			typeof iata === 'string',
			new UserError(`Invalid ${type}_iata`)
		);
		return [InputType.IATA, iata];
	}
	if (icao) {
		assert(
			typeof icao === 'string',
			new UserError(`Invalid ${type}_icao`)
		);
		return [InputType.ICAO, icao];
	}
	throw new UserError(`At least ${type}_iata or ${type}_icao required`);
};

const formatResult = (finderResult) => {
	if (finderResult === PathFinderResult.NA)  {
		return {
			success: false,
			message: 'Do not know the best route',
		};
	}
	if (finderResult === PathFinderResult.NO_PATH) {
		return {
			success: false,
			message: 'No path between provided airports',
		};
	}
	if (finderResult === PathFinderResult.TOO_LONG) {
		return {
			success: false,
			message: 'Path between provided airports too long',
		};
	}
	if (Array.isArray(finderResult)) {
		return {
			success: true,
			stops: finderResult.map((id) => getAirport(InputType.ID, id)),
		};
	}
};


module.exports = {
	UserError,
	find: (query) => {
		const fromInput = parseInput(query.from_iata, query.from_icao, 'from');
		const from = getAirport(...fromInput);
		if (!from) {
			throw new UserError('"from" airport not found');
		}

		const toInput = parseInput(query.to_iata, query.to_icao, 'to');
		const to = getAirport(...toInput);
		if (!to) {
			throw new UserError('"to" airport not found');
		}


		const route = pathFinder.find(from.id, to.id);
		return {
			from,
			to,
			route: formatResult(route),
		};
	},
};
