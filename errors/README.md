# Jungles Errors

Middleware for dealing with errors.

```js
require('jungles-errors').init(app);
```

```js
next({ type: 'http', error: 404 });
```

```js
next({ type: 'database', error: 'Connection problems' });
```
