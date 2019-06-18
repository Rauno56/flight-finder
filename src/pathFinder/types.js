const assert = require('assert');

const isStringOrNull = (val) => {
	return typeof val === 'string' || val === null;
};

class Airport {
	constructor({ id, name, iata, icao, lat, lng }) {
		assert(id, 'Invalid Airport, missing "id"');
		assert(name, 'Invalid Airport, missing "name"');
		assert(isStringOrNull(iata), 'Invalid Airport, missing "iata"');
		assert(isStringOrNull(icao), 'Invalid Airport, missing "icao"');
		assert(lat, 'Invalid Airport, missing "lat"');
		assert(lng, 'Invalid Airport, missing "lng"');

		Object.assign(this, { id, name, iata, icao, lat, lng });
	}
}

class Route {
	constructor({ from, to, distance }) {
		assert(from, 'Invalid Route, missing "from"');
		assert(to, 'Invalid Route, missing "to"');
		assert(distance, 'Invalid Route, missing "distance"');

		Object.assign(this, { from, to, distance });
	}
}

const PathFinderResult = {
	NA: Symbol('NA'),
	NO_PATH: Symbol('NO_PATH'),
	TOO_LONG: Symbol('TOO_LONG'),
};

module.exports = {
	PathFinderResult,
	Airport,
	Route,
};
