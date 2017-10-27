'use strict'

const path = require('path');

exports.getAll = function(req, res) {
	const hfc_code = require('../../hfc_codes/get_all');
	let options = {
	    wallet_path: path.join(__dirname, '../../creds'),
	    user_id: 'TestAdmin',
	    channel_id: 'mychannel',
	    chaincode_id: 'fabcar',
	    network_url: 'grpc://localhost:7051',
	};
	return hfc_code.query(options, res);
}

exports.getItem = function(req, res) {
	const hfc_code = require('../../hfc_codes/get_item');
	let options = {
	    wallet_path: path.join(__dirname, '../../creds'),
	    user_id: req.params.peerId,
	    channel_id: 'mychannel',
	    chaincode_id: 'fabcar',
   	    command: 'queryCar',
   	    args: [req.params.key],
	    peer_url: 'grpc://localhost:7051',
		event_url: 'grpc://localhost:7053',
		orderer_url: 'grpc://localhost:7050',
	};
	return hfc_code.invoke(options, res);
}

exports.getItemByOwner = function(req, res) {
	const hfc_code = require('../../hfc_codes/get_item');
	let options = {
	    wallet_path: path.join(__dirname, '../../creds'),
	    user_id: req.params.peerId,
	    channel_id: 'mychannel',
	    chaincode_id: 'fabcar',
   	    command: 'queryByOwner',
   	    args: [req.params.key],
	    peer_url: 'grpc://localhost:7051',
		event_url: 'grpc://localhost:7053',
		orderer_url: 'grpc://localhost:7050',
	};
	return hfc_code.invoke(options, res);
}

exports.getItemByColour = function(req, res) {
	const hfc_code = require('../../hfc_codes/get_item');
	let options = {
	    wallet_path: path.join(__dirname, '../../creds'),
	    user_id: req.params.peerId,
	    channel_id: 'mychannel',
	    chaincode_id: 'fabcar',
   	    command: 'queryByColour',
   	    args: [req.params.key],
	    peer_url: 'grpc://localhost:7051',
		event_url: 'grpc://localhost:7053',
		orderer_url: 'grpc://localhost:7050',
	};
	return hfc_code.invoke(options, res);
}


exports.putItem = function(req, res) {
	const hfc_code = require('../../hfc_codes/put_item');
	let options = {
	    wallet_path: path.join(__dirname, '../../creds'),
	    user_id: req.params.peerId,
	    channel_id: 'mychannel',
	    chaincode_id: 'fabcar',
		command: 'createCar',
   	    args: [req.params.key].concat(req.body.args),
		peer_url: 'grpc://localhost:7051',
		event_url: 'grpc://localhost:7053',
		orderer_url: 'grpc://localhost:7050',
	};
	return hfc_code.invoke(options, res);
}
