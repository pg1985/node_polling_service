var request = require('request');
var url     = require('url');

var PollerManager   = require('./lib/manager/PollerManager');
var MQManager       = require('./lib/utils/Rabbitmq');

var mqManager = new MQManager();
var pollerManager = new PollerManager(mqManager); 
