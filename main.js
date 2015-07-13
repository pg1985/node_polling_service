var request = require('request');
var url     = require('url');

var PollerManager   = require('./lib/manager/PollerManager');
var DatabaseManager = require('./lib/manager/DatabaseManager')
var MQManager       = require('./lib/utils/Rabbitmq');

var pollerManager = new PollerManager(); //automatically adding it's own data
var databaseManager = new DatabaseManager();
