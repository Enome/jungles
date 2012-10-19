# Jungles Data

All data access layers should have this API.

## Find

```js
var result = data.find(<query object>);

result.many(function (response) {
  // Always called
  // response: Array (can be empty)
});

result.one(function (response) {
  // called when there is atleast one result
  // { id, name, path, arrange, sort, ..data.. }
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

### Save (create, update)

```js
// Create
var result = data.save({ type: 'product', parent: 0, name: 'snowboard', arrange: '0' });
result.success(function (instance) {});
result.error(function (error) {});
```
These fields are required to create.

```js
// Update
var result = data.save({ id: 1, name: 'skateboard' });
result.success(function () {});
result.error(function (error) {});
```

If there is a data.id it should update.

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
  sort: '/0',
  arrange: 0,
  children: [
    {
      id: 2,
      name: 'tags',
      path: '/snowboard/tags',
      type: 'tags',
      sort: '/0/0',
      arrange: 0,

      children: [
        {
          id: 3,
          name: 'red',
          path: '/snowboard/tags/red',
          type: 'tag',
          sort: '/0/0/0',
          arrange: 0,
        }
      ]
    }
  ]
}
```

### Query object

```js
{ id: 5} 
{ path: /.*/ } 
{ path: /.*/, id: 5 } 
```

