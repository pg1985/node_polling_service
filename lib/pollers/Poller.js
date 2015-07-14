"use strict";
var events = require('events');
var EventEmitter = require('events').EventEmitter;


class Poller extends EventEmitter { 

	constructor(mediaUserId, pushupUserId, seconds) {
		super();
		this.interval = 0;
		this.mediaUserId = mediaUserId;
		this.pushupUserId = pushupUserId;
		this.seconds = seconds;

		this.startPolling();
	}//constructor

	startPolling() {
		this.interval = setInterval(this.pollService.bind(this), this.seconds);
	}

	stopPolling() {
		clearInterval(this.interval);
		this.interval = 0;
	}

	pollService() {

	}

	sendMessageToApi() {
			
	}
}

module.exports = Poller;
