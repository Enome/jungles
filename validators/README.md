# Jungles Validators

Validators and sanitizer to be used with [jungles-validation](http://github.com/Enome/jungles-validation).

## Validator api

```js

var validator = function (parameters) {

  // parameters: use these to pass extra info to validator. For example a custom message.

  return function (data, key, errors, sanitize, callback) {

    // data: the object that is getting validated
    // key: the key that is being validated
    // errors: object that holds your errors
    // sanitize: object that holds your sanitized data
    // callback: when everything is done

  });

};
```

## Jungles Validation

If you are using this with jungles-validation then you need to use the following api for your errors and sanitized values.

### Errors

Errors expect an object of arrays.

```js
var error = {
  key: [ 'error one' , 'error two' ]
}
```

The utils module has a helper to set values on an array that's a property of an object.

```js
pushValue(object, key, value);
```

### Sanitzed values

Normal object.

## Current validators and sanitizers

- required
- string

More will be added as we move forward.

## Test

mocha.js and should.js is needed.

```js
make test
```
