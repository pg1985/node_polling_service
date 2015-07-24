"use strict"; 

var util = require('util');
var amqp = require('amqp');
var ConfigurationManager = require('./ConfigurationManager');

class MQManager {

	constructor() {

		this.config = new ConfigurationManager();

		this.connect();
	}

	connect () {

		this.connection = amqp.createConnection({
		    host: this.config.getAmqpHost(),
		    port: this.config.getAmqpPort(),
		    login: 'rb_twit',
			password :'rb_coq1PZdts9',
		    heartbeat: 30
  		});

  		var $connection = this.connection;
  		var $config = this.config;
  		var $this = this;

  		this.connection.on('ready', () => {

  			$connection.exchange($config.getAmqpExchange(), {
				type: 'topic',
				durable: false,
				autoDelete: false
			});

			$connection.queue($config.getAmqpQueue() + '.connect', (q) => {
  				q.bind($config.getAmqpExchange(), '#');
				q.subscribe($this.startNewConnection.bind($this));
				
  			});

			$connection.queue($config.getAmqpQueue() + '.disconnect', (q) => {
	  			q.bind($config.getAmqpExchange(), '#');
				q.subscribe($this.removeConnection.bind($this));
  			});

  		});

  		this.connection.on('error', (err) => {
  			console.log(err);
  		});
 		
	}

	startNewConnection(data) {
		this.delegate.createNewSubscription(data);
	}

	removeConnection(data) {
		this.delegate.removeSubscription(data['subscription_id']);
	}

	//this should be formatted before reaching here.
	forwardMessageToAPI(message) {
		this.connection.publish("post", message, {}, () => {});
	}

	setDelegate(obj) {
		this.delegate = this.delegate || obj;
	}
}

module.exports = exports = MQManager;