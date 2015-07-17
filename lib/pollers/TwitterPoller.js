"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var Twitter = require('twitter');
var PostManager = require('../manager/PostManager');
var ConfigManager = require('../manager/ConfigurationManager')

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

		request({
			url: $this.baseURL + $this.buildURL(this.pollData),
			method: $this.method
		}, (error, res, html) => {
			if (!error) {
				result = connection.checkMessage(html).then((res) => {
					$this.mqManager.forwardMessageToAPI(html);
				}).catch((err) => {
					console.log(err);
				});
			}
		});
	}

}

module.exports = TwitterPoller;