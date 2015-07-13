"use strict";

var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var ConfigurationManager = require('./ConfigurationManager');

class Database {

	constructor(table) {
		this.table = table; //twitter, instagram, pinterest, etc.
		this.config = new ConfigurationManager();
		this.mongoURL = this.config.getMongoUrl(true); //true = local mode, for running locally/etc.
		this.database = false;

		this.connect(table);
	}

	connect(table) {

		var $this = this;
		
		MongoClient.connect(this.mongoURL, {server: {poolSize:1}}, function (err, db){
			if (err) {
				console.log("Cannot connect with... " + this.mongoURL);
			} else {
				if(!$this.database)
					$this.database = db;

				//to test
				$this.checkMessage("abc");
			}
		});
	}

	disconnect () {
		//disconnect from database, just in case.
	}

	getAccessToken(userID) {

	}

	checkMessage(postID) {
		if (this.database) {
			var networkTableCollection = this.database.collection(this.table);
			console.log(networkTableCollection);
			return true; //for now
		} else {
			return false;
		}
	}
}

module.exports = Database;