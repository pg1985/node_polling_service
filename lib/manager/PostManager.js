"use strict";

class PostManager {

	constructor (MQ) {
		this.MQ = MQ;
	}

	sendPostToAPI (data) {
		console.log("postManager received Data");
		this.MQ.forwardMessageToAPI(data);
	}
}

module.exports = PostManager;