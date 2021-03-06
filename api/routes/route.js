'use strict'

module.exports = function(app) {
	const bodyParser = require('body-parser');
	const controller = require('../controllers/controller');

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	app.route('/asset')
		.get(controller.getAll);
	
	app.route('/asset/:peerId/:key')
		.get(controller.getItem)
		.put(controller.putItem);

	app.route('/asset/:peerId/owner/:key')
		.get(controller.getItemByOwner);

	app.route('/asset/:peerId/colour/:key')
		.get(controller.getItemByColour);

};
