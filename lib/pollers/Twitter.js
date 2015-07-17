"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var PostManager = require('../manager/PostManager');

class TwitterPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], ms);

		this.defaultUrl = "https://api.twitter.com/1.1/"
		this.queryURL = this.configureURL()

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	configureURL(type, args) {
		args = args || {};
	}

	pollService(queryString) {

	}

	sendMessageToApi(messageData) {
		this.mqManager.forwardMessageToAPI(messageData);
	}

}

module.exports = TwitterPoller;