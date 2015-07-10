"use strict";
var events = require('events');


class Poller extends EventEmitter {

	var seconds = 60 * 1000;
	var url = "";
	var interval;
	var mediaUserId;
	var pushupUserId;

	constructor(_mediaUserId, _pushupUserId) {
		mediaUserId = _mediaUserId;
		pushupUserId = _pushupUserId;
		this.startPolling();
	}//constructor

	function startPolling() {
		interval = setInterval(pollService, seconds);
	}

	function stopPolling() {
		clearInterval(interval);
		interval = 0;
	}

	function pollService() {
		//get userInfo

	}

	this.on("message", function(e) {

	});

}

module.exports = Poller;
