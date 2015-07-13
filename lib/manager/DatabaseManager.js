"use strict"; 

var Database = require('../utils/Database')

class DatabaseManager {

	constructor() {
		this.connections = [];

		this.addConnection("twitter");
		this.addConnection("instagram");
	}//constructor

	addConnection(tableName) {

		// here, create your instance with your data needed for that particular subscription.
		this.connections.push(new Database(tableName));
	}

}

module.exports = DatabaseManager;
