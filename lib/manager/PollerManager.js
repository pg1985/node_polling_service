"use strict"; 

var test = require ('../pollers/test');
var DatabaseManager = require('./DatabaseManager')

class PollerManager {

	constructor() {
		this.databaseManager = new DatabaseManager();
		this.subscriptions = [];


		this.addSubscription("test", "tag", {"pushupUserId": "don", "mediaUserId": "johnson", "tag_name": "#sharkie"}, "GET", 2000);
		this.addSubscription("test", "userfeed", {"pushupUserId": "Mr", "mediaUserId": "T"}, "POST",  3000);

	}//constructor

	addSubscription(network, type, data, method, ms) {
		//default values
		method = method || "GET";
		ms = ms || 60000;

		// here, create your instance with your data needed for that particular subscription.
		//needs to be an if-else for each network unfortunately.  
		if (network === "test") {
			this.subscriptions.push(new test(type, data, method, ms, this.databaseManager.getConnectionByTableName(network)));
		}
		else if (network === "twitter") {
			//this.subscriptions.push(new TwitterPoller(type, data, method, ms));
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
}

module.exports = PollerManager;