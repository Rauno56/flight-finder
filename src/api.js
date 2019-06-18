const assert = require('assert');
const databaseUtils = require('./pathFinder/databaseUtils.js');
const PathFinder = require('./pathFinder/PathFinder.js');
const airportCacheGenerator = require('./airportCacheGenerator.js');
const { PathFinderResult, InputType, UserError } = require('./types.js');

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

const formatResult = (finderResult, stopFormatter) => {
	stopFormatter = stopFormatter || ((i) => i);
	assert(typeof stopFormatter, 'function', 'Expected function for stopFormatter');

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
			stops: finderResult.map(stopFormatter),
		};
	}
};


module.exports = (database) => {
	databaseUtils.validate(database);

	const getAirport = airportCacheGenerator(database.airports);
	const pathFinder = new PathFinder(database.routes);

	return {
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
				route: formatResult(route, (id) => getAirport(InputType.ID, id)),
			};
		},
	};
};
