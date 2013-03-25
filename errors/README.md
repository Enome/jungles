# Jungles Errors

Middleware for dealing with errors.

```js
require('jungles-errors').init(app, <optional path to custom error view>);
```

```js
next({ type: 'http', error: 404 });
```

```js
next({ type: 'database', error: 'Connection problems' });
```
