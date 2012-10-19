# Getting started

## Step 1: Create an Express.js app and an HTTP server.

```js
var http = require('http');
var express = require('express');

// App

var app = express();

// Server

http.createServer(app).listen(3000);
```

## Step 2: Setup the view engine

```js
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
```

## Step 3: Define a data layer

For this example we will be using in memory data. This means that you lose your data on each restart.

```js
var data = require('jungles-data-memory')([]);
```

## Step 4: Create types for your rest service.

In Jungles the data is a tree structure with nodes. The nodes are created by a type which defines the structure of the node. Since the node is an instance of a type we call them instances.

So lets define some types.

```js
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

Next we need to setup the form with a body field for the page type. So in your view directory create a director called forms and add the following jade markup to page.jade.

```jade
fieldset

  legend Data

  div
    label(for='id_body') Body
    textarea#id_body(name='body', ng-model='data.body')
```

## Step 5: Setup and mount the rest service.

First you need to give the rest service the data and types.

```js
var rest = require('jungles-rest').init({ data: data, types: types });
```

Next we'll mount it to our base application.

```js
app.use('/jungles/api', rest);
```

You can now try and see if it works by visiting /jungles/api/instances and /jungles/api/types.


## Step 6: Setup and mount the admin control panel

Now that we have a rest api we can add a control panel that consumes that api.

```js
var panel = require('jungles-panel').init('/jungles/api');
```

You need to tell the control panel where it can find the rest api.

```js
app.use('/jungles', panel);
```

Mount it to your base application.
