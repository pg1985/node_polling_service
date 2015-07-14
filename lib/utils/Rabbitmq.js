"use strict"; 

var util = require('util');
var amqp = require('amqp');
var ConfigurationManager = require('./ConfigurationManager');

class MQManager {
	constructor() {
		this.config = new ConfigurationManager();

		this.host = this.config.getAmqpHost();
		this.port = this.config.getAmqpPort();
		this.queue = this.config.getAmqpQueue();
		this.exchange = this.config.getAmqpExchange();

		this.connect()
	}

	connect () {

		this.connection = amqp.createConnection({
		    host: this.config.getAmqpHost(),
		    port: this.config.getAmqpPort(),
		    login: this.config.getAmqpUserName(),
		    password: this.config.getAmqpPassword(),
		    heartbeat: 30
  		});
	}

}

module.exports = exports = MQManager;