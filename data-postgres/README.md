# Jungles Data Postgres

## Setup

```js
var data = require('jungles-data-postgres')({
  user: 'james',
  password: '1234',
  database: 'jungles',
  host: '127.0.0.1'
});

data.setup(); // Creates table called instances
```

## API

[Data API](http://github.com/Enome/jungles-data)

## Postgres specific

Query objects get translated.

```js
{ id: 5} 
// SELECT * FROM instances where id = 5;

{ path: /.*/ } 
// SELECT * FROM instance WHERE path ~ .*;

{ path: /.*/, id: 5 } 
// SELECT * FROM instances WHERE path ~ .* and id = 5;
```

## Test

mocha.js and should.js is needed. Tests are run against a real database so you need to have postgresql. Check specs/db for database settings.

```js
make test
```
