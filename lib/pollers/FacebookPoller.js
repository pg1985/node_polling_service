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

		this.accessToken = data['access_token'];

		this.sinceTime = "";

		this.type = data['type'];
		this.userId = data['user_media_id'];

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	pollService() {
		var $this = this;
		var connection = $this.dbConnection;
		var result;

		fb.api(
			this.getEdge(), 
			{},
			function(response) {
				if (response && !response.error) {
					var currentPosts = response['data'];
					$this.sinceID = currentPosts[0]['created_time'];
					for(var i=0; i<currentPosts.length;i++) {
						var currentPost = currentPosts[i];
						(function(currentPost) {
							result = connection.checkMessage(currentPost['id']).then((res) => {
								console.log("GOt past Mongo");
								$this.mqManager.forwardMessageToAPI($this.formatPost(post));
							}).catch((err) => {
								//nothing more needs to be done.
							});
						})(currentPost);

					}//for post in posts
				} else if (response.error) {
					console.log(response.error);
				}
			});
		
		
	}//pollservice

	getEdge() {
		return this.userId + "/feed?limit=10&access_token="+this.accessToken + "&since=" + this.sinceTime;
	}

	getAppAccessToken () {

	}


	getParameters() {
		var parameterDict = {};

		
		return parameterDict;
	}

	formatPost(rawPostData) {
		var postData = {};
		postData['meta_data'] = {};
		postData['id'] = uuid.v4();

		postData['meta_data']['id'] = rawPostData['id'];
		postData['meta_data']['provider'] = "facebook";
		postData['meta_data']['message'] = rawPostData['message'];

		if(rawPostData['picture'] !== undefined) {
			postData['meta_data']['src_url'] = rawPostData['picture'];
			postData['meta_data']['type'] = "photo";
		} else {
			postData['meta_data']['type'] = "status";
		}

		return postData;
	}
}

module.exports = FacebookPoller;