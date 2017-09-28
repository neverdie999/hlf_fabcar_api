'use strict';

exports.query = function(options, response) {
	const hfc = require('fabric-client');
	const client = new hfc();
	Promise.resolve().then(() => {
		console.log("Create a client and set the wallet location");
		return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
	}).then((wallet) => {
		console.log("Set wallet path, and associate user ", options.user_id, " with application");
		client.setStateStore(wallet);
		return client.getUserContext(options.user_id, true);
	}).then((user) => {
		console.log("Check user is enrolled, and set a query URL in the network");
		if (user === undefined || user.isEnrolled() === false) {
			console.error("User not defined, or not enrolled - error");
		}
		const channel = client.newChannel(options.channel_id);
		channel.addPeer(client.newPeer(options.network_url));
		return channel;
	}).then((channel) => {
	    console.log("Make query");
	    const transaction_id = client.newTransactionID();
	    console.log("Assigning transaction_id: ", transaction_id.getTransactionID());
	    const request = {
			chaincodeId: options.chaincode_id,
			txId: transaction_id,
			fcn: 'queryAllCars',
			args: ['']
	    };
	    return channel.queryByChaincode(request);
	}).then((query_responses) => {
	    console.log("returned from query");
	    if (!query_responses.length) {
			console.log("No payloads were returned from query");
	    } else {
			console.log("Query result count = ", query_responses.length)
	    }
	    if (query_responses[0] instanceof Error) {
			console.error("error from query = ", query_responses[0]);
	    }
		
		const data = query_responses[0].toString();
		    console.log("Response is ", data);
		    response.json(JSON.parse(data));
		return response.send(data);
	}, (err) => {
		return err;
	});
}

