var http = require('http');
var express = require('express');

// App

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// Data Layer

var data = require('jungles-data-memory')([]);

// Types

var validators = require('jungles-validators');

var types = [
  {
    name: 'page',
    form: 'forms/page',
    root: true,
    schema: { body: [ validators.required(), validators.string() ] }
  },

  {
    name: 'products',
    children: [ 'page' ],
    root: true
  }
];

// Mount rest

var rest = require('jungles-rest').init({ data: data, types: types });
app.use('/jungles/api', rest);

// Mount panel

var panel = require('jungles-panel').init('/jungles/api');
app.use('/jungles', panel);

// Server

http.createServer(app).listen(3000);
