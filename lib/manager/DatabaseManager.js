"use strict"; 

var Database = require('../utils/Database')

class DatabaseManager {

	constructor() {
		this.connections = {};

		this.addConnection("test");
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
