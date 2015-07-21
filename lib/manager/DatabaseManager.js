"use strict"; 

var Database = require('../utils/Database')

class DatabaseManager {

	constructor() {
		this.connections = {};

		this.addConnection("twitter");
		this.addConnection("facebook");
		this.addConnection("instagram");
	}//constructor

	addConnection(tableName) {

		// here, create your instance with your data needed for that particular subscription.
		this.connections[tableName] = new Database(tableName);
	}

	getConnectionByTableName(tableName) {
		return this.connections[tableName];
	}
}

module.exports = DatabaseManager;
