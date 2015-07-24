"use strict";
var events = require('events');
var EventEmitter = require('events').EventEmitter;

class Poller extends EventEmitter { 

	constructor(mediaUserId, pushupUserId, subscriptionID, seconds) {
		super();
		this.subscriptionID = subscriptionID;
		this.interval = 0;
		this.mediaUserId = mediaUserId;
		this.pushupUserId = pushupUserId;
		this.seconds = seconds;

		this.emitter = new EventEmitter();

		this.startPolling();
	}//constructor

	configureURL(type) {
		//override me
	}

	startPolling() {
		this.interval = setInterval(this.pollService.bind(this), this.seconds);
	}

	stopPolling() {
		clearInterval(this.interval);
		this.interval = 0;
	}

	pollService() {
		//override me
	}

	sendMessageToApi() {
		//override me
	}

	checkSubscriptionID(subID) {
		if (subID === this.subscriptionID)
			return true;

		return false;
	}
}

module.exports = Poller;
