var express = require('express');
var request = require('request');
var url     = require('url');

var app = express();

app.get('/', function(req, res) {
	res.json('{"this": true}');
});

app.listen('9917');

exports = module.exports = app;