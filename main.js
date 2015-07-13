var request = require('request');
var url     = require('url');

var PollerManager   = require('./lib/manager/PollerManager');
var DatabaseManager = requre('./lib/utils/database');
var MQManager       = require('./lib/utils/rabbitmq');

var manager = new PollerManager(); //automatically adding it's own data

