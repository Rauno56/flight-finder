const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const readRoutes = (filePath) => parse(fs.readFileSync(filePath), {
	columns: [
		'airline',
		'airlineId',
		'from',
		'fromId',
		'to',
		'toId',
		'codeshare',
		'stops',
		'equipment',
	],
	skip_empty_lines: true
});

const readAirlines = (filePath) => parse(fs.readFileSync(filePath), {
	columns: [
		'id',
		'name',
		'alias',
		'iata',
		'icao',
		'callsign',
		'country',
		'active',
	],
	skip_empty_lines: true
});

const readAirports = (filePath) => parse(fs.readFileSync(filePath), {
	columns: [
		'id',
		'name',
		'city',
		'country',
		'iata',
		'icao',
		'lat',
		'lng',
		'altitude',
		'timeOffset',
		'dst',
		'tz',
		'type',
		'source',
	],
	skip_empty_lines: true
});

module.exports = {
	readRoutes,
	readAirlines,
	readAirports,
};
