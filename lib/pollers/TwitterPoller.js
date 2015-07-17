"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var PostManager = require('../manager/PostManager');

class TwitterPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.sinceID = "";
		this.sinceIDList = [];

		this.pollingURL = "https://api.twitter.com/1.1/" + this.buildURL(data);

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	buildURL(data) {
		var finalString = "";
		var type = data['type'];

		console.log(type);

		if (type === 'tag') {
			finalString = "search/tweets.json?q="
			finalString = finalString + data['tag_name'];
			finalString = finalString +'&result_type=mixed';
			if(this.sinceID !== "")
				finalString = finalString + '&since_id=' + this.sinceID;
		
		} else if (type === 'userfeed') {
			finalString = 'statuses/user_timeline.json?trim_user=true&include_rts=false&exclude_repiles=true'
			finalString = finalString + '&user_id=' + data['user_media_id'];
			if (this.sinceID !== "")
				finString = finalString + '&since_id=' + this.sinceID
		}

		console.log(finalString);

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