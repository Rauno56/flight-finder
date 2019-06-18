const { Airport, Route } = require('./types');

module.exports = {
	load: (filePath) => {
		const contents = require(filePath);

		return {
			routes: contents.map((i) => new Route(i)),
			airports: contents.map((i) => new Airport(i)),
		};
	},
};
