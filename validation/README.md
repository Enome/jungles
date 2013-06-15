# Jungles Validation

You can find validators for jungles-validation at [jungles-validators](http://github.com/Enome/jungles-validators).

## Api

```js
var validators = require('jungles-validators');

var schema = {
  name: [ validators.required(), validators.string() ]
};

var data = {
  name: 'James'
};

var result = validate(data, schema);

result.valid(function (response) {
  // response: sanitized data
  // example: { name: 'James' }
});

result.invalid(function (errors) {
  // errors: object of arrays with errors
  // example: { name: [ 'String is required' ] }
});
```

## Test

mocha.js and should.js is needed.

```js
make test
```
