"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var Twitter = require('twitter');
var PostManager = require('../manager/PostManager');
var ConfigManager = require('../utils/ConfigurationManager')

class TwitterPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		this.config = new ConfigManager();
		this.pollData = data;

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.sinceID = "";
		this.sinceIDList = [];

		this.baseURL = "https://api.twitter.com/1.1/";

		this.type = data['type'];

		this.twitterClient = new Twitter({
		    'consumer_key': this.config.getTwitterAppId(),
		    'consumer_secret': this.config.getTwitterAppSecret(),
		    'access_token_key': data['access_token'],
		    'access_token_secret': data['access_secret']});

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	buildURL(data) {
		var finalString = "";
		var type = data['type'];

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

		return finalString;
	}

	pollService() {
		var $this = this;
		var connection = $this.dbConnection;
		var result;

		if (this.type === "userfeed") {
			this.twitterClient.get('statuses/user_timeline.json', this.getParameters(), (error, tweet, response) => {
				if(error) throw error;
				result = connection.checkMessage(tweet['id']).then((res) => {
					$this.sinceID = tweet['id'];
					$this.mqManager.forwardMessageToAPI(tweet);
				}).catch((err) => {
					console.log(err);
				});
		});

		} else if (this.type === "tag") {
			this.twitterClient.get('search/tweets.json', this.getParameters(), (error, tweet, response) => {
				if(error) throw error;
				result = connection.checkMessage(tweet['id']).then((res) => {
					$this.sinceID = tweet['id'];
					$this.mqManager.forwardMessageToAPI(tweet);
				}).catch((err) => {
					console.log(err);
				});
			});
		}

	}

	getParameters() {
		var parameterDict = {};

		if (this.type === 'tag') {
			parameterDict['q'] = encodeURIComponent(this.pollData['tag_name']);
			parameterDict['result_type'] = 'mixed';
			if(this.sinceID !== "")
				parameterDict['since_id'] = this.sinceID;
		
		} else if (this.type === 'userfeed') {
			parameterDict['trim_user'] = true; 
			parameterDict['count'] = 1;
			parameterDict['include_rts'] = false;
			parameterDict['exclude_repiles'] = true;
			parameterDict['user_id'] = this.pollData['user_media_id'];
			if(this.sinceID !== "")
				parameterDict['since_id'] = this.sinceID;
		}

		return parameterDict;
	}

	formatPost(rawTweetData) {
		tweetData = {};

		tweetData['meta_data']['id'] = rawTweetData['user']['id_str'];
		tweetData['meta_data']['provider'] = "twitter";
		if (rawTweetData['extended_entities']) {
			ext_entities = rawTweetData['extended_entities'];

			var tweet_data_list = [];
			if (ext_entities['media']) {
				for (entity in ext_entities) {
					var new_meta = {}
					new_meta['provider'] = "twitter";
					new_meta['src_url'] = entity['media_url_https'];
					new_meta['id'] = rawTweetData['user']['id_str'];
					new_meta['type'] = "photo";
					new_meta['message'] = entity['text'];

					tweet_data_list.push(new_meta);
				}

				tweetData['meta_data'] = tweet_data_list
			}
		} else {
			tweetData['meta_data']['type'] = "status"
		}

		if (!tweetData['meta_data'].isArray())
			tweet_data_list['meta_data'] = [tweetData['meta_data']];

		console.log(tweetData)
		return tweetData;
	}

}

module.exports = TwitterPoller;