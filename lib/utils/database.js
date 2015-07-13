var util = require('util');
var amqp = require('mongodb');
var ConfigurationManager = require('./ConfigurationManager');

class Database {

	constructor(table) {
		this.url = table; //twitter, instagram, pinterest, etc.
		this.config = new ConfigurationManager();
		this.mongoURL = this.config.getMongoURL();
	}

	connect(networkName) {
		//connect to the database.
	}

	disconnect (networkName) {
		//disconnect from database, just in case.
	}

	checkMessage(postID) {
		//see if the postID has been saved to the database.  IF so, don't send to the API
	}
}