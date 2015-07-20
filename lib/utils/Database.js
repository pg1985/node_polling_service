"use strict";

var Q = require('q');
var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var ConfigurationManager = require('./ConfigurationManager');

class Database {

	constructor(table) {

		this.table = table; //twitter, instagram, pinterest, etc.
		this.config = new ConfigurationManager();
		this.mongoURL = this.config.getMongoUrl(true); //true = local mode, for running locally/etc

		var $this = this;
		MongoClient.connect(this.mongoURL, {server: {poolSize:1}}, (err, db) => {
			if (err) {
				console.log("Cannot connect with... " + $this.mongoURL);
				//retry?
			} else {
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
		var deferred = Q.defer();

		this.database.collection(this.table).insert({"post_id": postID}, (err, res) => {
			if (err)
				deferred.reject(err);
			else
				deferred.resolve(res);
		});

		return deferred.promise;
	}
}

module.exports = Database;