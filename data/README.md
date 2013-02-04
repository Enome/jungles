# Jungles Data

If you are thinking of creating your own data layer for jungles you can use this module to test it.

```js
var data = require('your-dal');
var test = require('jungles-data');

test(data, true); // true=bail on first fail
```

## API

### Find

```js
var result = data.find(<query object>); // Info query object at bottom

result.many(function (response) {
  // Always called
  // response: Array (can be empty)
});

result.one(function (response) {
  // called when there is atleast one result
  // { name, path, sort, ..data.. }
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
result.success(function () { });
result.error(function (error) { });
```

### Create

```js
var result = data.create({ name: 'products', order: 0 });
var result = data.create({ parent: '/products', name: 'snowboard', order: 0 });

result.success(function (instance) { });
result.error(function (error) { });
```

### Result

```js
[ 
  { name: 'products', path: '/products', sort: [0] },
  { name: 'snowboard', path: '/products/snowboard', sort: [0, 0] }
]
```

## Update

```js
var result = data.update({ path: '/products/snowboard', name: 'skateboard', order: 1 });

result.success(function (instance) { });
result.error(function (error) { });
```

### Result

```js
[ 
  { name: 'products', path: '/products', sort: [0] },
  { name: 'skateboard', path: '/products/skateboard', sort: [0, 1] }
]
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

### Query object

```js
{ id: 5} // Integer
{ name: 'home' } // String
{ path: /.*/ }  // Regex
{ path: /.*/, id: 5 } // Both
```

