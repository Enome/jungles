# Jungles Middleware

This is middleware should be used in the parent app.


```js
var middleware = require('jungles-middleware');
app.get(':path(*)', middleware(jungles)); 
```

## Types

```js
var product = {
  middleware: function (req, res, next) {
    
  }
}
```
### Middleware

By default middleware gets executed and if it is undefined jungles-middleware will try and render a view with the name of the type.

### Locals

- res.locals.tree: The complete tree of the project
- res.locals.current: The current instance
