# Types

This module puts the validation layer infront of data.create, data.update and data.copy. So you don't always have to manually call validate when updating or creating data. 

## Create

```js
var dal = require('jungles-data-memory')([]);
var settings = [ /* array with your types and schemas */ ];

var t = types(settings, dal).create({ name: 'snowboard', type: 'product' });

t.success(function (response) {
  // response is the created object
});

t.error(function (errors) {
  // errors are validation errors
});
```

## Update

```js
var dal = require('jungles-data-memory')([]);
var settings = [ /* array with your types and schemas */ ];
var t = types(settings, dal).update({ path '/snowboard', name: 'skateboard' });

t.success(function (response) {
  // response is the updated object(s)
});

t.error(function (errors) {
  // errors are validation errors
});
```

## Copy

```js
var dal = require('jungles-data-memory')([]);
var settings = [ /* array with your types and schemas */ ];
var t = types(settings, dal).copy({ path: '/snowboard', parent: '/' });

t.success(function (response) {
  // response is the created object(s)
});

t.error(function (errors) {
  // errors are validation errors
});
```
