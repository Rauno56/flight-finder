const path = require('path');

const defaultDatabaseFilePath = path.join(__dirname, '..', 'database.json');

module.exports = {
	port: parseInt(process.env.FF_PORT) || 3000,
	databaseFilePath: path.resolve(process.env.FF_DB_PATH || defaultDatabaseFilePath),
};
