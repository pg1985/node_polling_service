var util = require('util');
var amqp = require('amqp');
var ConfigurationManager = require('./ConfigurationManager');

function Rabbit () {
  debugger;
  this.config = new ConfigurationManager();
  this.connect();
}

util.inherits(
  Rabbit,
  require('events').EventEmitter
);

Rabbit.prototype.connect = function () {
  var host = this.config.getAmqpHost();
  var port = this.config.getAmqpPort();
  var queue = this.config.getAmqpQueue();
	var exchange = this.config.getAmqpExchange();

  global.log.info('AMQP Connecting', {
    host: host,
    port: port,
    login: this.config.getAmqpUserName(),
    password: this.config.getAmqpPassword(),
    heartbeat: 30
  });

  this.connection = amqp.createConnection({
    host: host,
    port: port,
    login: this.config.getAmqpUserName(),
    password: this.config.getAmqpPassword(),
    heartbeat: 30
  });

	var connection = this.connection;
	var handleConnectMessage = this.handleConnectMessage.bind(this);
	var handleDisconnectMessage = this.handleDisconnectMessage.bind(this);

	connection.on('ready', function () {
    global.log.info('AMQP Connected', {
      host: host,
      port: port,
    });

		// Declare the exchange so it's available to us
		connection.exchange(exchange, {
			type: 'topic',
			durable: false,
			autoDelete: false
		});

    global.log.info('AMQP Declared Exchange', {
      exchange: exchange
    });

		connection.queue(queue + '.connect', function (q) {
			q.bind(exchange, '#');
			q.subscribe(handleConnectMessage);

      global.log.info('AMQP Declared & Subscribed to Connection Queue', {
        queue: queue + '.connect'
      });
		});

		connection.queue(queue + '.disconnect', function (q) {
			q.bind(exchange, '#');
			q.subscribe(handleDisconnectMessage);

      global.log.info('AMQP Declared & Subscribed to Disconnection Queue', {
        queue: queue + '.disconnect'
      });
		});
	});

	/**
	 * node-amqp 0.2.x globally and quietly handles exceptions.
	 * Isn't that great? Isn't it??
	 *
	 * This error event handler will automatically throw exceptions
	 * as expected, but we only want this behavior on develoment
	 * environments, since it breaks node-amqp's reconnection logic
	 * apparently. Currently we're always throwing exceptions.
	 *
	 * https://github.com/postwait/node-amqp/issues/323
	 */
	connection.on('error', function (err) {
		throw err;
	});
};

Rabbit.prototype.handleConnectMessage = function (message) {
	// Expected Message Format:
	// https://pushup-notes.hackpad.com/Twitter-Proxy-1.0-vixBYj8qP8Q

	var data      = JSON.parse(message.data.toString());

	var returnId  = data.id;
	var arguments = data.args;

	if ( !arguments.access_token || !arguments.access_secret ) return;

	this.emit('subscribe', {
		userId: arguments.user_id,
		accessToken: arguments.access_token,
		accessTokenSecret: arguments.access_secret
	});
};

Rabbit.prototype.handleDisconnectMessage = function (message) {
	// Expected Message Format:
	// https://pushup-notes.hackpad.com/Twitter-Proxy-1.0-vixBYj8qP8Q

	var data      = JSON.parse(message.data.toString());

	var returnId  = data.id;
	var arguments = data.args;

	if ( arguments.access_token || arguments.access_secret ) return;

	this.emit('unsubscribe', {
		userId : arguments.user_id
	});
};

module.exports = exports = function () {
  global.rabbit = global.rabbit || new Rabbit();
  return global.rabbit;
};