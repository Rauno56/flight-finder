const assert = require('assert');

const printRandom = (array) => {
	console.log(pickRandom(array));
};

const pickRandom = (array) => {
	assert(Array.isArray(array));

	const idx = (Math.random() * array.length) >> 0;
	return array[idx];
};

const assertAllOfType = (array, Type) => {
	assert(Array.isArray(array));
	array.forEach((item) => {
		assert(item instanceof Type);
	});
};

module.exports = {
	assertAllOfType,
	pickRandom,
	printRandom,
};
