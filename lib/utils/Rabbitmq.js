"use strict"; 

var util = require('util');
var amqp = require('amqp');
var ConfigurationManager = require('./ConfigurationManager');

class MQManager {

	constructor() {
		super();

		console.log(this.emitter);

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
		
	}
}

module.exports = exports = MQManager;