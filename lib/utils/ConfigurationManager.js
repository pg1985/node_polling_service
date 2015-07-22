function ConfigurationManager () {
}

ConfigurationManager.prototype.getTwitterAppId = function () {
  return process.env['TWITTER_CONSUMER_KEY'] || "";
};

ConfigurationManager.prototype.getTwitterAppSecret = function () {
  return process.env['TWITTER_SECRET'] || "";
};

ConfigurationManager.prototype.getFacebookAppID = function () {
  return process.env['FACEBOOK_APP_ID'] || "";
};

ConfigurationManager.prototype.getFacebookAppSecret = function () {
  return process.env['FACEBOOK_SECRET'] || "";
};

ConfigurationManager.prototype.getInstagramAppID = function () {
  return process.env['INSTAGRAM_APP_ID'] || "";
};

ConfigurationManager.prototype.getInstagramAppSecret = function () {
  return process.env['INSTAGRAM_SECRET'] || "";
};

ConfigurationManager.prototype.getTumblrAppID = function () {
  return process.env['TUMBLR_APP_ID'] || "";
};

ConfigurationManager.prototype.getTumblrAppSecret = function () {
  return process.env['TUMBLR_SECRET'] || "";
};

ConfigurationManager.prototype.getAmqpHost = function () {
  return process.env['AMQP_HOST'] || '127.0.0.1';
};

ConfigurationManager.prototype.getAmqpPort = function () {
  return 5672;
};

ConfigurationManager.prototype.getAmqpUserName = function () {
  return process.env['AMQP_LOGIN'] || 'guest';
};

ConfigurationManager.prototype.getAmqpPassword = function () {
  return process.env['AMQP_PASSWORD'] || 'guest';
};

ConfigurationManager.prototype.getAmqpExchange = function () {
  return process.env['AMQP_EXCHANGE'] || 'twitter';
};

ConfigurationManager.prototype.getAmqpQueue = function () {
  return process.env['AMQP_QUEUE'] || 'twitter';
};

ConfigurationManager.prototype.getLogFile = function () {
  return process.env['LOG_FILE'] || 'log.txt';
};

ConfigurationManager.prototype.getMongoUrl = function (debug) {
  var databaseName = 'ServiceDB';
  if(debug) {
    return 'mongodb://127.0.0.1/' + databaseName;
  } else {
	return 'mongodb://'
		+ process.env['SERVICEDB_USER'] + ':'
		+ process.env['SERVICEDB_PASSWORD'] + '@'
		+ process.env['MONGODB_HOST'] + '/'
		+ databaseName 
  }
    
};

ConfigurationManager.prototype.getSocialProxyEndpoint = function () {
  return process.env['SOCIAL_ENDPOINT'] || 'http://social-proxy-staging.pushup.com/twitter/update';
};

module.exports = exports = ConfigurationManager;