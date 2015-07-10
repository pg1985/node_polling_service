var request = require('request');
var url     = require('url');

var PollerManager = require('./lib/manager/PollerManager')

var manager = new PollerManager(); //automatically adding it's own data

