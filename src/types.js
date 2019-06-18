const assert = require('assert');

const isStringOrNull = (val) => {
	return typeof val === 'string' || val === null;
};

class UserError extends Error {}

class Airport {
	constructor({ id, name, iata, icao, lat, lng }) {
		assert.equal(typeof id, 'string', `Invalid Airport, "id" not a string. Got ${id}`);
		assert.equal(typeof name, 'string', `Invalid Airport, "name" not a string. Got ${name}`);
		assert(isStringOrNull(iata), `Invalid Airport, "iata" not a string nor null. Got ${iata}`);
		assert(isStringOrNull(icao), `Invalid Airport, "icao" not a string nor null. Got ${icao}`);
		assert.equal(typeof lat, 'number', `Invalid Airport, "lat" not a number. Got ${lat}`);
		assert.equal(typeof lng, 'number', `Invalid Airport, "lng" not a number. Got ${lng}`);

		Object.assign(this, { id, name, iata, icao, lat, lng });
	}
}

class Route {
	constructor({ from, to, distance }) {
		assert.equal(typeof from, 'string', `Invalid Route, "from" not a string. Got ${from}`);
		assert.equal(typeof to, 'string', `Invalid Route, "to" not a string. Got ${to}`);
		assert.equal(typeof distance, 'number', `Invalid Route, "distance" not a number. Got ${distance}`);

		Object.assign(this, { from, to, distance });
	}
}

const PathFinderResult = {
	NA: Symbol('NA'),
	NO_PATH: Symbol('NO_PATH'),
	TOO_LONG: Symbol('TOO_LONG'),
};

const InputType = {
	IATA: Symbol('IATA'),
	ICAO: Symbol('ICAO'),
	ID: Symbol('ID'),
};

module.exports = {
	Airport,
	InputType,
	PathFinderResult,
	Route,
	UserError,
};
