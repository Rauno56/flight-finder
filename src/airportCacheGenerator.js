const assert = require('assert');

const { Airport, InputType } = require('./types.js');
const { assertAllOfType } = require('./utils.js');

module.exports = (airportList) => {
	assertAllOfType(airportList, Airport);

	const indexNew = (acc, type, key, item) => {
		if (item[key] === null) return;
		assert.equal(typeof item[key], 'string', `Expected string for ${key}`);
		assert(!acc[type].has(item[key]), `Duplicate airport with ${key} = ${item[key]}`);

		acc[type].set(item[key].toLowerCase(), item);
	};

	const airports = airportList.reduce((acc, item) => {
		indexNew(acc, InputType.IATA, 'iata', item);
		indexNew(acc, InputType.ICAO, 'icao', item);
		indexNew(acc, InputType.ID, 'id', item);

		return acc;
	}, {
		[InputType.IATA]: new Map(),
		[InputType.ICAO]: new Map(),
		[InputType.ID]: new Map(),
	});

	const getAirport = (type, value) => {
		return airports[type].get(value.toLowerCase());
	};


	return getAirport;
};
