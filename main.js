var request = require('request');
var url     = require('url');

var PollerManager   = require('./lib/manager/PollerManager');
var DatabaseManager = require('./lib/manager/DatabaseManager')
var MQManager       = require('./lib/utils/Rabbitmq');

var databaseManager = new DatabaseManager();
var pollerManager = new PollerManager(); 