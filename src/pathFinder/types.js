const assert = require('assert');

class Airport {
	constructor({ id, name, iata, icao, lat, lng }) {
		assert(id, 'Missing id');
		assert(name, 'Missing name');
		assert(iata, 'Missing iata');
		assert(icao, 'Missing icao');
		assert(lat, 'Missing lat');
		assert(lng, 'Missing lng');

		Object.assign(this, { id, name, iata, icao, lat, lng });
	}
}

class Route {
	constructor({ from, to, distance }) {
		assert(from, 'Missing from');
		assert(to, 'Missing to');
		assert(distance, 'Missing distance');

		Object.assign(this, { from, to, distance });
	}
}

module.exports = {
	Airport,
	Route,
};
