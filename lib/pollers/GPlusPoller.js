"use strict";

var Poller = require('./Poller');
var request = require('request');
var Google = require('googleapis');
var PostManager = require('../manager/PostManager');
var ConfigManager = require('../utils/ConfigurationManager')
var uuid = require('uuid');
var request = require('request');

class GPlusPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		this.config = new ConfigManager();
		this.pollData = data;

		this.gplus = Google.plus('v1');

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.sinceID = "";
		this.sinceIDList = [];

		this.userId = data['user_media_id'];
	}


	pollService() {
		var $this = this;
		var connection = $this.dbConnection;
		var result;

		console.log($this.getURL());

		request($this.getURL(), (error, response, body) => {
			body = JSON.parse(body);
			console.log(body['items']);
			var items = body['items'];

			for(var i=0; i<items.length; i++) {
				var post = items[i];
				console.log(post['id']);
			}
		});
		
	}

	getURL() {
		return "https://www.googleapis.com/plus/v1/people/" + this.userId + "/activities/public?key=" + this.config.getGPlusApiKey();
	}


	formatPost(rawPostData) { 

	}

}

module.exports = GPlusPoller;