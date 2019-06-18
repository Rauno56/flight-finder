const express = require('express');
const app = express();
const port = 3000;
const database = require('./pathFinder/databaseUtils.js').loadFile('../../res.json');
const { UserError } = require('./types.js');
const { find } = require('./api')(database);

app.get('/', (req, res) => {
	const result = find(req.query);
	res.json(result);
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
