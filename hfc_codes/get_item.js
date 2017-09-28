'use strict';

exports.invoke = function(options, res) {
	const hfc = require('fabric-client');
	const client = new hfc();
	const util = require('util');
	const targets = [];
	let channel = null;
	let tx_id = null;
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
		channel = client.newChannel(options.channel_id);
		const peerObj = client.newPeer(options.peer_url);
		channel.addPeer(peerObj);
		channel.addOrderer(client.newOrderer(options.orderer_url));
		targets.push(peerObj);
		return;
	}).then(() => {
		tx_id = client.newTransactionID();
		console.log("Assigning transaction_id: ", tx_id.getTransactionID());
		// send proposal to endorser
		const request = {
		    targets: targets,
		    chaincodeId: options.chaincode_id,
		    fcn: options.command,
		    args: options.args,
		    chainId: options.channel_id,
		    txId: tx_id
		};
		return channel.sendTransactionProposal(request);
	}).then((results) => {
		const proposalResponses = results[0];
		const proposal = results[1];
		const header = results[2];
		let isProposalGood = false;
		if (proposalResponses && proposalResponses[0].response 
			&& proposalResponses[0].response.status === 200) {
		    isProposalGood = true;
		    console.log('transaction proposal was good');
		} else {
		    console.error('transaction proposal was bad');
		}

		if (isProposalGood) {
		    console.log(util.format(
		        'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
		        proposalResponses[0].response.status, proposalResponses[0].response.message,
		        proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
		    

		    	return {"status": "SUCCESS", "data": proposalResponses[0].response.payload};
		} else {
		    console.error(
		        'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
		    );
		    return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
		}
	}, (err) => {
		console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
		    err);
		return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
		    err;
	}).then((response) => {
		if (response.status === 'SUCCESS') {
		    console.log('Successfully sent transaction to the orderer.');
		    return res.json({"tx_id": tx_id.getTransactionID(), "data": JSON.parse(response.data)});
		} else {
		    console.error('Failed to order the transaction. Error code: ' + response.status);
		    return 'Failed to order the transaction. Error code: ' + response.status;
		}
	}, (err) => {
		console.error('Failed to send transaction due to error: ' + err.stack ? err
		    .stack : err);
		return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
		    err;
	});
}

