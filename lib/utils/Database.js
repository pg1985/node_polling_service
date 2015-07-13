"use strict";

var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var ConfigurationManager = require('./ConfigurationManager');

class Database {

	constructor(table) {
		console.log("A database instance constructor");
		this.table = table; //twitter, instagram, pinterest, etc.
		this.config = new ConfigurationManager();
		this.mongoURL = this.config.getMongoUrl(true); //true = local mode, for running locally/etc.
		this.database = false;

		this.connect(table);
	}

	connect(table) {

		var $this = this;
		
		MongoClient.connect(this.mongoURL, function (err, db){
			if (err) {
				console.log("Cannot connect with... " + this.mongoURL);
			} else {
				if(!$this.database)
					$this.database = db;
			}
		});
	}

	disconnect () {
		//disconnect from database, just in case.
	}

	getAccessToken(userID) {

	}

	checkMessage(postID) {
		var networkTable = this.database.collection(this.table);
	}
}

module.exports = Database;