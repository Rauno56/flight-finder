const assert = require('assert');
const { Airport, Route } = require('./types');

const allOfType = (array, Type) => {
	assert(Array.isArray(array));
	array.forEach((item) => {
		assert(item instanceof Type);
	});
};

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
	validate: (data) => {
		allOfType(data.airports, Airport);
		allOfType(data.routes, Route);
	},
};
