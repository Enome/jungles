# Types

This module puts the validation layer infront of data.create and data.update. So you don't always have to manually call validate when updating or creating data. This will be used by the rest layer in the future so we have one place to create and update data + validation.

## API


### Create

```js
var data = require('jungles-data-memory');
var t = types(settings, data([])).create({ name: 'snowboard', type: 'product' });

t.success(function (response) {
  // response is the created object
});

t.error(function (errors) {
  // errors are validation errors
});
```

### Update

```js
var data = require('jungles-data-memory');
var t = types(settings, data([])).update({ path '/snowboard', name: 'skateboard' });

t.success(function (response) {
  // response is the updated object
});

t.error(function (errors) {
  // errors are validation errors
});
```
