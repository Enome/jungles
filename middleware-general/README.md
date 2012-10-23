# General Middleware

General middleware written for Jungles but can be used with any Express.js app.

# Render

```js
app.get('/', render('index'));
```

# Redirect

```js
app.get('/', render('/somewhere'));
```

# Send

Takes a function that returns the value to be send. The 'this' of the function is { req, res }.

```js
middleware.send(function () { return this.res.locals.user; });
```
