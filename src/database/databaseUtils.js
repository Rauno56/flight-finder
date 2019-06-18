const assert = require('assert');

const { Airport, Route } = require('../types');
const { assertAllOfType } = require('../utils.js');

const utils = module.exports = {
	loadFile: (filePath) => {
		const contents = require(filePath);
		return utils.load(contents);
	},
	load: (data) => {
		assert(
			Array.isArray(data.airports),
			`Expected array for "data.airports", got ${typeof data.airports}`
		);
		assert(
			Array.isArray(data.routes),
			`Expected array for "data.routes", got ${typeof data.routes}`
		);

		return {
			airports: data.airports.map((i) => new Airport(i)),
			routes: data.routes.map((i) => new Route(i)),
		};
	},
	serialize: (data) => {
		console.log(JSON.stringify(data));
	},
	validate: (data) => {
		assertAllOfType(data.airports, Airport);
		assertAllOfType(data.routes, Route);
	},
};
