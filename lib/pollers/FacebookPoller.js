"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var Twitter = require('twitter');
var PostManager = require('../manager/PostManager');
var ConfigManager = require('../utils/ConfigurationManager')
var uuid = require('uuid');
var fb = require('fb');

class FacebookPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		this.config = new ConfigManager();
		this.pollData = data;

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.sinceID = "";
		this.sinceIDList = [];

		this.type = data['type'];
		this.userId = data['user_media_id'];

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	pollService() {
		var $this = this;
		var connection = $this.dbConnection;

		fb.api(
			this.getEdge(), 
			{},
			function(response) {
				if (response && !response.error) {
					console.log(response);
				} else if (response.error) {
					console.log(response.error);
				}
			});
		
		
	}//pollservice

	getEdge() {
		if(this.type == "user")
			return this.userId + "/feed";

	}

	getAppAccessToken () {
		
	}


	getParameters() {
		var parameterDict = {};

		
		return parameterDict;
	}

	formatPost(rawTweetData) {

	}
}

module.exports = FacebookPoller;