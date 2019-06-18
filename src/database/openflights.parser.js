const assert = require('assert');
const geolib = require('geolib');

const read = require('./read');
const databaseUtils = require('./databaseUtils');
const { Airport, Route } = require('../types');

const NULL_STRING = '\\N';
const findAirport = (airports, id, code) => {
	const matcher = (item) => {
		return item.id === id || item.code === code;
	};
	return airports.find(matcher);
};

const parser = module.exports = (airportFilePath, routeFilePath) => {
	const airports = read.readAirports(airportFilePath)
		.reduce((acc, item) => {
			try {
				if (item.iata === NULL_STRING) {
					item.iata = null;
				}
				if (item.icao === NULL_STRING) {
					item.icao = null;
				}
				item.lat = parseFloat(item.lat);
				item.lng = parseFloat(item.lng);
				acc.push(new Airport(item));
			} catch (e) {
				console.error('Ignoring airport', item, e.message);
			}
			return acc;
		}, []);

	const routes = read.readRoutes(routeFilePath)
		.reduce((acc, item) => {
			try {
				if (item.stops !== '0') {
					throw new Error('Multi-stop route');
				}

				const from = findAirport(airports, item.fromId, item.from);
				const to = findAirport(airports, item.toId, item.to);

				assert(from, 'From airport missing from DB');
				assert(to, 'To airport missing from DB');

				const distance = geolib.getDistance(
					{ latitude: from.lat, longitude: from.lng },
					{ latitude: to.lat, longitude: to.lng },
				);

				acc.push(new Route({
					from: from.id,
					to: to.id,
					distance,
				}));
			} catch (e) {
				console.error(`Ignoring route ${item.from} > ${item.to}`, e.message);
			}

			return acc;
		}, []);

	return {
		routes,
		airports,
	};
};

if (require.main === module) {
	// eslint-disable-next-line no-unused-vars
	const [_bin, _script, airportsFilePath, routesFilePath] = process.argv;

	const data = parser(airportsFilePath, routesFilePath);

	databaseUtils.serialize(data);
}
