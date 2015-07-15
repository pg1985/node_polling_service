"use strict"; 

var util = require('util');
var amqp = require('amqp');
var ConfigurationManager = require('./ConfigurationManager');

class MQManager {

	constructor() {

		this.config = new ConfigurationManager();

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

  		this.connection.queue(this.queue + '.connect', function(q) {
  			q.bind(exchange, '#');
			q.subscribe(handleConnectMessage);
  		});

  		this.connection.exchange(this.exchange, {
			type: 'topic',
			durable: false,
			autoDelete: false
		});
	}

	forwardMessageToAPI(message) {
		//send message to API
	}

	startNewConnection() {

		//interpert incoming MQ message

		if(this.delegate) {
			this.delegate.createNewConnection(data);
		}
	}

	setDelegate(obj) {
		this.delegate = obj;
		console.log("delegate set");
	}
}

module.exports = exports = MQManager;