var request = require('request');
var url     = require('url');

var PollerManager   = require('./lib/manager/PollerManager');
var MQManager       = require('./lib/utils/Rabbitmq');

var pollerManager = new PollerManager(); 