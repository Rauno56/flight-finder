const path = require('path');
const { PathFinderType } = require('./types.js');

const defaultDatabaseFilePath = path.join(__dirname, '..', 'database.json');

module.exports = {
	pathFinderType: (
		(process.env.FF_PATH_FINDER_TYPE || '').trim().toLowerCase() === 'rust' ?
			PathFinderType.RUST : PathFinderType.JS
	),
	port: parseInt(process.env.FF_PORT || '') || 3000,
	databaseFilePath: path.resolve(process.env.FF_DB_PATH || defaultDatabaseFilePath),
};
