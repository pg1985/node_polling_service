"use strict"; 

//var test = require ('../pollers/test');

class PollerManager {

	constructor() {
		this.subscriptions = [];

		this.addSubscription("tag", {"pushupUserId": "don", "mediaUserId": "johnson", "tag_name": "#sharkie"}, "GET", 2000);
		this.addSubscription("userfeed", {"pushupUserId": "Mr", "mediaUserId": "T"}, "POST",  3000);

	}//constructor

	addSubscription(type, data, method, ms) {
		//default values
		method = method || "GET";
		ms = ms || 60000;

		// here, create your instance with your data needed for that particular subscription.
		//this.subscriptions.push(new test(type, data, method, ms));
		console.log("This would work otherwise");
	}

	removeSubscription(subscriptionId) {

	}

	getSubscription(subscriptionId) {

	}
}

module.exports = PollerManager;
