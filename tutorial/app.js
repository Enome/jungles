var http = require('http');
var express = require('express');

// Media

var media = __dirname + '/media';

// Express

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/static'));

// Jungles

var types = require('./types');
var data = require('jungles-data-memory')(require('./data'));
var rest = require('jungles-rest').init({ data: data, types: types });
var panel = require('jungles-panel').init('/jungles/api');

// Helpers

require('jungles-helpers').init(app);
require('./helpers').init(app);

// Mount

app.use('/jungles/api', rest.app);
app.use('/jungles', panel.app);

// Middleware

//app.get(':path(*)', require('jungles-middleware')(jungles));

// Error Handling

require('jungles-errors').init(app);

// Create ̛& start server

var port = 5555;
http.createServer(app).listen(port, function () {
  console.log('Visit http://0.0.0.0:' + port + '/en or http://0.0.0.0:' + port + '/jungles');
});
