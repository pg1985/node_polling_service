"use strict"; 

var Poller = require('./Poller');
var request = require('request');
var PostManager = require('../manager/PostManager');
var ConfigManager = require('../utils/ConfigurationManager')
var uuid = require('uuid');
var ig = require('instagram-node');

class InstagramPoller extends Poller {

	constructor (data, dbConnection, mqManager, ms) {
		super(data['user_pushup_id'], data['user_media_id'], data['subscription_id'], ms);

		this.config = new ConfigManager();
		this.pollData = data;

		this.subscriptionID = data['subscription_id'];

		this.dbConnection = dbConnection;
		this.mqManager = mqManager;

		this.instagram = ig.instagram();

		this.instagram.use({'access_token': data['access_token']})
		this.instagram.use({'client_id': this.config.getInstagramAppID(), 'client_secret': this.config.getInstagramAppSecret()})

		this.minID = "";

		this.defaultURL = "https://api.instagram.com/v1/"

		this.type = data['type'];
		this.userId = data['user_media_id'];

		this.ms = ms || 60000;
		this.method = data['method'] || "GET";	
	}

	pollService() {
		var $this = this;
		var connection = $this.dbConnection;
		var result;

		var options = {};
		options['count'] = 3;

		if (this.type === "user") {
			if ($this.minID !== "") 
				options['min_id'] = $this.minID;
			
			$this.instagram.user_media_recent($this.userId, options, (err, medias, pagination, remaining, limit) => {
				$this.minID = medias[0]['id'];
					

				for (var i=0; i< medias.length; i++){
					var image = medias[i];
					(function (image) {
						result = connection.checkMessage(image['id']).then((res) => {
							$this.mqManager.forwardMessageToAPI($this.formatPost(image));
						}).catch((err) => {
						});
					}) (image)
				}
			});
		} else if (this.type === "tag") {
			$this.instagram.tag_media_recent($this.pollData['tag_name'], options, (err, medias, pagination, remaining, limit) => {
				$this.minID = medias[0]['id'];		
				for (var i=0; i< medias.length; i++){
					var image = medias[i];
					(function (image) {
						result = connection.checkMessage(image['id']).then((res) => {
							$this.mqManager.forwardMessageToAPI($this.formatPost(image));
						}).catch((err) => {
						});
					}) (image)
				}
			});
		}
	}//pollservice

	getParameters() {
		var parameterDict = {};

		
		return parameterDict;
	}

	formatPost(rawPostData) {
		var postData = {};
		postData['meta_data'] = {};

		postData['id'] = uuid.v4();

		
		postData['meta_data']['provider'] = "instagram";
		postData['meta_data']['type'] = "photo";
		postData['meta_data']['message'] = rawPostData['caption']['text'] || "";
		postData['meta_data']['src_url'] = rawPostData['images']['standard_resolution']['url'];

		postData['meta_data'] = [postData['meta_data']];

		return postData;
	}
}

module.exports = InstagramPoller;