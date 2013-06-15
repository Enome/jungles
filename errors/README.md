# Jungles Errors

Middleware for dealing with errors. The reason why this isn't an app you can mount is because apps can't catch errors from other apps (bug?). This also should be last in the Express stack so it can catch 404s.

## API

```js
require('jungles-errors')(/* your express app */, /* optional path to custom error view */);
```

## Mount

```js
var app = express();
require('jungles-errors')(app, __dirname + '/template.jade'); // template.jade string is optional.
```

## Throw errors

If the type is `'http'` the correct response code is set.

```js
next({ type: 'http', error: 404 });
```

If the type isn't `'http'` a 500 Internal Server Error is shown.

```js
next({ type: 'database', error: 'Connection problems' });
```
