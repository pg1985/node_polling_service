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
			consumer_key: this.config.getTumblrAppID(),
			consumer_secret: this.config.getTumblrAppSecret(),
			token: data['access_token'],
			token_secret: data['access_secret']
		});

		// console.log(this.tumblr);

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
			for (var i=0; i < resp.posts.length; i++) {
				var post = resp.posts[i];
				(function (post) {
						result = connection.checkMessage(post['id']).then((res) => {
							$this.mqManager.forwardMessageToAPI($this.formatPost(post));
						}).catch((err) => {
						});
					}) (post)
			}
		});
	}//pollservice

	formatPost(rawPostData) {
		var postData = {};
		postData['meta_data'] = {};

		postData['id'] = postData['id'] = uuid.v4();

		postData['meta_data']['provider'] = "tumblr";
		postData['meta_data']['id'] = this.userId;

		if (rawPostData['type'] === 'text') {
			postData['meta_data']['type'] = "status";
			postData['meta_data']['message'] = rawPostData['content'];
		}else if (rawPostData['type'] === 'photo') {
			postData['meta_data']['type'] = "photo";
			postData['meta_data']['src_url'] = rawPostData['photos'][0]['original_size']['url'];
			postData['meta_data']['message'] = rawPostData['caption'];

		}

		return postData;
	}
}

module.exports = InstagramPoller;