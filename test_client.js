'use strict'

const request = require('request');
const options = {
	url: 'http://localhost:3000/asset/TestAdmin/CAR11',
	body: {'args': ['1981', 'SIN', 'DiamondBlue', 'Bright']},
	json: true
};

request.put(options, function(err, res, body) {
	if (err) {
		console.log('code: ' + err);
	}

	if (res) {
		console.log(res.body);
	}
});

