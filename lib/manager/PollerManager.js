"use strict"; 

var TwitterPoller = require ('../pollers/TwitterPoller');
var FacebookPoller = require ('../pollers/FacebookPoller');
var InstagramPoller = require ('../pollers/InstagramPoller');
var DatabaseManager = require('./DatabaseManager');
var PostManager = require('./PostManager');

class PollerManager {

	constructor(mqManager) {
		this.databaseManager = new DatabaseManager();
		this.mqManager = mqManager;

		this.mqManager.setDelegate(this);
		this.subscriptions = [];

		//this.addSubscription("test", "tag", {"pushupUserId": "don", "mediaUserId": "johnson", "tag_name": "#sharkie"}, "GET", 2000);
		//this.addSubscription("test", "userfeed", {"pushupUserId": "Mr", "mediaUserId": "T"}, "POST",  3000);

	}//constructor

	addSubscription(data) {
		//default values
		var method = data['method'] || "GET";
		var ms = data['ms'] || 60000;
		var network = data['network'];

		// here, create your instance with your data needed for that particular subscription.
		//needs to be an if-else for each network unfortunately.  

		if (network === "test") {
			this.subscriptions.push(new test(data, 
											 this.databaseManager.getConnectionByTableName(network), 
											 this.mqManager,
											 ms));
		}
		else if (network === "twitter") {
			this.subscriptions.push(new TwitterPoller(data, 
											 this.databaseManager.getConnectionByTableName(network), 
											 this.mqManager,
											 ms));
		} else if (network === "facebook") {
			this.subscriptions.push(new FacebookPoller(data, 
											 this.databaseManager.getConnectionByTableName(network), 
											 this.mqManager,
											 ms));
		} else if(network === "instagram") {
			this.subscriptions.push(new InstagramPoller(data, 
											 this.databaseManager.getConnectionByTableName(network), 
											 this.mqManager,
											 ms));
		}
	}

	removeSubscription(subscriptionId) {
		for (subscription in this.subscriptions) {

		}

	}

	getSubscription(subscriptionId) {
		for (subscription in this.subscriptions) {
			
		}
	}

	createNewSubscription(data){
		var $this = this;
		$this.addSubscription(data);
	}
}

module.exports = PollerManager;