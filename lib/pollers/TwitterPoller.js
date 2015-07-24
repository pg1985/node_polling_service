"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var Twitter = require('twitter');
var PostManager = require('../manager/PostManager');
var ConfigManager = require('../utils/ConfigurationManager')
var uuid = require('uuid');

class TwitterPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		this.config = new ConfigManager();
		this.pollData = data;

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.sinceID = "";
		this.sinceIDList = [];

		this.isRateLimited = false;

		this.baseURL = "https://api.twitter.com/1.1/";

		this.type = data['type'];
		this.userId = data['user_media_id'];

		global.log.info("Created a new Twitter listener at:", {twitterID: this.userId});

		this.twitterClient = new Twitter({
		    'consumer_key': this.config.getTwitterAppId(),
		    'consumer_secret': this.config.getTwitterAppSecret(),
		    'access_token_key': data['access_token'],
		    'access_token_secret': data['access_secret']});

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	pollService() {
		var $this = this;
		var connection = $this.dbConnection;
		var result;


		if (this.type === "userfeed") {
			this.twitterClient.get('statuses/user_timeline.json', this.getParameters(), (error, tweets, response) => {
				if(error) {$this.handleError(error);}
				var statuses = tweets['statuses']

					if($this.sinceID === "") {
						$this.sinceID = statuses[0]['id']; 
						return;
					} else {
						$this.sinceID = statuses[0]['id']; 
					}

				for (var i=0; i < tweets.length; i++) {
					var currentStatus = statuses[i];

					

					(function (status) {
						result = connection.checkMessage(status['id']).then((res) => {
							$this.mqManager.forwardMessageToAPI($this.formatPost(status));
						}).catch((err) => {
							//nothing more needs to be done.
							//console.log(err);
						});
					}) (currentStatus)
				}
			});

		} else if (this.type === "tag") {
			this.twitterClient.get('search/tweets.json', this.getParameters(), (error, tweets, response) => {
				if(error) {$this.handleError(error);}
				var statuses = tweets['statuses']

					if($this.sinceID === "") {
						$this.sinceID = statuses[0]['id']; 
						return;
					} else {
						$this.sinceID = statuses[0]['id']; 
					}

				for (var i=0; i < statuses.length; i++) {
					var currentStatus = statuses[i];

					(function (status) {
						result = connection.checkMessage(status['id']).then((res) => {
							$this.mqManager.forwardMessageToAPI($this.formatPost(status));
						}).catch((err) => {
							//nothing more needs to be done.
							//console.log(err);
						});
					}) (currentStatus)
				}
			});
		}

		
	}//pollservice


	getParameters() {
		var parameterDict = {};

		if (this.type === 'tag') {
			parameterDict['q'] = encodeURIComponent(this.pollData['tag_name']);
			parameterDict['result_type'] = 'mixed';
			parameterDict['include_rts'] = false;
			parameterDict['exclude_repiles'] = true;
			parameterDict['trim_user'] = true; 

			if(this.sinceID !== "")
				parameterDict['since_id'] = this.sinceID;
			else
				parameterDict['count'] = 1;
		
		} else if (this.type === 'userfeed') {
			parameterDict['trim_user'] = true; 
			parameterDict['include_rts'] = false;
			parameterDict['exclude_repiles'] = true;
			this.pollData['tag_name']? parameterDict['screen_name'] = this.pollData['tag_name'] : parameterDict['user_id'] = this.pollData['user_media_id'];

			if(this.sinceID !== "")
				parameterDict['since_id'] = this.sinceID;
			else
				parameterDict['count'] = 1;
		}

		return parameterDict;
	}

	formatPost(rawTweetData) {

		var tweetData = {};
		tweetData['meta_data'] = {}

		tweetData['id'] = uuid.v4();

		tweetData['meta_data']['id'] = rawTweetData['user']['id_str'] || this.userId;
		tweetData['meta_data']['provider'] = "twitter";
		if (rawTweetData['extended_entities']) {
			ext_entities = rawTweetData['extended_entities'];

			var tweet_data_list = [];
			if (ext_entities['media']) {
				for (entity in ext_entities) {
					var new_meta = {}
					new_meta['provider'] = "twitter";
					new_meta['src_url'] = entity['media_url_https'];
					new_meta['id'] = rawTweetData['user']['id_str'] || this.userId;
					new_meta['type'] = "photo";
					new_meta['message'] = entity['text'];

					tweet_data_list.push(new_meta);
				}

				tweetData['meta_data'] = tweet_data_list
			}
		} else {
			tweetData['meta_data']['type'] = "status"
			tweetData['meta_data']['message'] = rawTweetData['text'];
		}

		if (!Array.isArray(tweetData['meta_data']))
			tweetData['meta_data'] = [tweetData['meta_data']];

		return tweetData;
	}

	handleError(error) {
		if (error.statuscode === 429 || error.statuscode === "429") {
			this.stopPolling();
			global.log.warn("Account %s has been rate limited, has queried too many times.", this.userId);
			setTimeout(this.startPolling, 1000 * 60 * 15);
		}
	}

	removeRateLimit

}

module.exports = TwitterPoller;