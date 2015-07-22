"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var PostManager = require('../manager/PostManager');
var ConfigManager = require('../utils/ConfigurationManager')
var uuid = require('uuid');
var tumblr = require('tumblr.js');


class InstagramPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		this.config = new ConfigManager();
		this.pollData = data;

		this.subscriptionID = data['subscription_id'];

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.tumblr = new tumblr.Client({

		});

		this.instagram.use({'access_token': data['access_token']})
		this.instagram.use({'client_id': this.config.getInstagramAppID(), 'client_secret': this.config.getInstagramAppSecret()})

		this.minID = "";

		this.defaultURL = "https://api.tumblr.com/v2/blog/"

		this.type = data['type'];
		this.userId = data['user_media_id'];

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	pollService() {
		var $this = this;
		var connection = $this.dbConnection;
		var result;

		$this.tumblr.posts($this.pollData['blog_name'], (err, resp) => {

		});
	}//pollservice

	formatPost(rawPostData) {
		var postData = {};
		postData['meta_data'] = {};

		return postData;
	}
}

module.exports = InstagramPoller;