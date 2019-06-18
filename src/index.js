const assert = require('assert');
const express = require('express');
const app = express();
const port = 3000;
const { airports: airportList } = require('./pathFinder/databaseUtils.js').loadFile('../../res.json');

class UserError extends Error {}

const InputType = {
	IATA: Symbol('IATA'),
	ICAO: Symbol('ICAO'),
	ID: Symbol('ID'),
};
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


const indexNew = (acc, type, key, item) => {
	if (item[key] === null) return;
	assert.equal(typeof item[key], 'string');
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
const getAirport = ([type, value]) => {
	return airports[type].get(value.toLowerCase());
};

app.get('/', (req, res) => {
	const from = getAirport(
		parseInput(req.query.from_iata, req.query.from_icao, 'from')
	);
	const to = getAirport(
		parseInput(req.query.to_iata, req.query.to_icao, 'to')
	);
	res.json({
		from,
		to,
	});
});

app.use((err, req, res, next) => {
	console.error(err);
	if (err instanceof UserError) {
		res.status(400);
		return res.json({ error: err.message });
	}
	res.status(500);
	res.json({ error: 'Server error' });
});

app.listen(port, () => console.log(`Flight route planner listening on ${port}!`));
