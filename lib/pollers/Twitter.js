"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var PostManager = require('../manager/PostManager');

class TwitterPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		this.apiURL = "https://api.twitter.com/1.1/";
		this.queryURL = this.configureURL(data);

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.sinceID = "";
		this.sinceIDList = [];

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	buildURL(data) {
		var finalString = "";
		var type = data['type'];

		if (type === 'tag') {
			finalString = "search/tweets.json?q="
			encodeURIComponent(arg);
			finalString.concat(arg)
		
		} else if (type === 'userfeed') {
			finalString = 'statuses/user_timeline.json?trim_user=1'
			finalString.concat('&user_id=' + data['user_media_id'])
			if (this.sinceID !== "")
				finString.concat('&since_id=' + this.sinceID)
		}

		return finalString;
	}

	pollService(queryString) {
		var $this = this;

	}

	sendMessageToApi(messageData) {
		this.mqManager.forwardMessageToAPI(messageData);
	}

}

module.exports = TwitterPoller;