"use strict"; 

var winston = require('winston');


var TwitterPoller = require ('../pollers/TwitterPoller');
var FacebookPoller = require ('../pollers/FacebookPoller');
var InstagramPoller = require ('../pollers/InstagramPoller');
var TumblrPoller = require ('../pollers/TumblrPoller');
var DatabaseManager = require('./DatabaseManager');
var PostManager = require('./PostManager');


class PollerManager {

	constructor(mqManager) {
		this.databaseManager = new DatabaseManager();
		this.mqManager = mqManager;

		this.initLogging();

		this.mqManager.setDelegate(this);
		this.subscriptions = [];

	}//constructor

	addSubscription(data) {
		//default values
		var method = data['method'] || "GET";
		var ms = data['ms'] || 60000;

		// if (network === "test") {
		// 	this.subscriptions.push(new test(data, 
		// 									 this.databaseManager.getConnectionByTableName(network), 
		// 									 this.mqManager,
		// 									 ms));
		// }
		if (data['network'] === "twitter") {
			this.subscriptions.push(new TwitterPoller(data, 
											 this.databaseManager.getConnectionByTableName(data['network']), 
											 this.mqManager,
											 ms));

		} else if (data['network'] === "facebook") {
			this.subscriptions.push(new FacebookPoller(data, 
											 this.databaseManager.getConnectionByTableName(data['network']), 
											 this.mqManager,
											 ms));
		} else if(data['network'] === "instagram") {
			this.subscriptions.push(new InstagramPoller(data, 
											 this.databaseManager.getConnectionByTableName(data['network']), 
											 this.mqManager,
											 ms));
		} else if (data['network'] === "tumblr") {
			this.subscriptions.push(new TumblrPoller(data, 
											 this.databaseManager.getConnectionByTableName(data['network']), 
											 this.mqManager,
											 ms));
		}

		global.log.info("Added Subscription:", {userID: data['user_pushup_id'], network: data['network'], subscriptionID: data['subscription_id']});
	}

	removeSubscription(subscriptionId) {
		console.log(subscriptionId);
		for (var i=0; i < this.subscriptions.length; i++) {
			console.log(this.subscriptions[i]);
			if (this.subscriptions[i].checkSubscriptionID(subscriptionId)) {
				this.subscriptions[i].stopPolling();
				this.subscriptions[i] = 0;
				global.log.info("Removed Subscription:", {subscriptionID: subscriptionId});

			}
		}

	}

	createNewSubscription(data){
		var $this = this;
		$this.addSubscription(data);
	}

	initLogging () {

		global.log = new winston.Logger({
		    transports: [
		      new winston.transports.Console({
		        handleExceptions: true
		      }),

		      new winston.transports.File({
		        filename: "log.txt",
		        handleExceptions: true,
		        maxsize: 10000000 // Limit log files to 10 MB each
		      })
		    ],

		    exitOnError: false
		  });
	}
}

module.exports = PollerManager;