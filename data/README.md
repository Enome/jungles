# Jungles Data

If you are thinking of creating your own data layer for jungles you can use this module to test it.

```js
var dal = require('your-dal');
var test = require('jungles-data');

// The test expect this data for each test.

var createData = function () {
  var boards = { type: 'category', path: '/boards', name: 'Boards', sort: [0], color: 'red', order: 0 };
  var blades = { type: 'category', path: '/blades', name: 'Blades', sort: [1], color: 'blue', order: 1 };
  var skateboard = { type: 'product', path: '/boards/skateboard', name: 'Skateboard', sort: [0, 0], order: 0 };
  var wheel = { type: 'part', path: '/boards/skateboard/wheel', name: 'Wheel', sort: [0, 0, 0], order: 0 };
  return [boards, skateboard, wheel, blades];
};

var settings = {
  bail: true,                                                  // bail tests after one failure.
  beforeEach: function (done) { database.set(createData()); }, // reset your database before each test.
}

test(dal, settings);
```

## API

The data layer supports the following methods.

```js
data.find(/* query object */);
data.remove(/* query object */);
data.create(/* data */);
data.update(/* data */);
data.copy(/* data */);
```

### Query object

```js
{ id: 5} // Integer
{ name: 'home' } // String
{ path: /.*/ }  // Regex
{ path: /.*/, id: 5 } // path (Regex) AND id (Integer)
```

### Find

```js
var result = data.find(<query object>);

result.many(function (response) {
  // Always called
  // response: Array (can be empty)
});

result.one(function (response) {
  // called when there is atleast one result
  // response: One instance
});

result.empty(function () { 
  // called when result is empty
});

result.error(function (error) {
  // error
});
```

### Remove

```js
var result = data.remove(<query object>);
result.success(function (response) { 

  // response: Array with deleted instances

});
result.error(function (error) { });
```

### Create

```js
var result = data.create({ name: 'products', order: 0 });

result.success(function (response) { 
  // response: { name: 'products', path: '/products', sort: [0] },
});

result.error(function (error) {});
```

### Update

```js
var result = data.update({ path: '/products/snowboard', name: 'skateboard', order: 1 });

result.success(function (response) { 
  // response: Array with all the updated instances.
});

result.error(function (error) { });
```

Update is lazy if you don't specify certain values it will keep the old ones. If you update an instance with children the children will update as well if path or order changes.

### Move

Move is done with `data.update` when you provide a parent.

### Copy

```js
var result = data.copy({ parent: '/', path: '/products/snowboard' });

result.success(function (response) { 
  // response: Array with all the copied instances.
});

result.error(function (error) { });

This will copy the instance and all it's children.
```

### Tree

```js
var result = data.tree(<query object>); 
result.success(function (tree) { });
result.error(function (error) { });
```

#### Structure

```js
{
  id: 1,
  name: 'snowboard',
  path: '/snowboard',
  type: 'product',
  sort: [0],
  children: [
    {
      id: 2,
      name: 'tags',
      path: '/snowboard/tags',
      type: 'tags',
      sort: [0, 0],

      children: [
        {
          id: 3,
          name: 'red',
          path: '/snowboard/tags/red',
          type: 'tag',
          sort: [0, 0, 0]
        }
      ]
    }
  ]
}
```
