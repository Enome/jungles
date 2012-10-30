# Jungles Frontend Middleware

Middleware will take the current url and find the related instance and it will load the whole tree.

You get the following locals in your views:

## Locals

```js
res.locals.tree // The complete tree of the project
res.locals.current // The current instance
```

## Setup

```js
var middleware = require('jungles-middleware');
app.get(':path(*)', middleware(jungles)); 
```

## Types

This middleware will allow you to add a middleware method to your types. If you don't specifiy this method it will try and render a view with the name of your type. So if you have a product type it will try and look for views/product view.

```js
var product = {
  middleware: function (req, res, next) { }
}
```

## Warning

Because the whole tree structure is loaded into memory on each request this module might not be suited for big sites. So start with this module if you run into performance issues fork it and make some adjustments.

If you do think about premature optimizing your site I would like to leave you with the this message:

![batman slap](http://i.qkme.me/3rken9.jpg)
