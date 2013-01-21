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

## Middleware

You can also define extra middleware on your types. If you don't specifiy this method it will try and render a view with the name of your type. So if you have a product type it will try and look for views/product view.

```js
var type = {
  middleware: function (req, res, next) { 
    res.locals.foobar = res.locals.current.foobar;
    next();
  }
}
```

This is useful if you want to do something extra with your response before rendering a template.

## Constants

You can also define constants on your types. For example if you want to hide some type in your navigation you could do the following.


```js
var product = {
  constants: {
    hide: true
  }
}
```

This will add a hide property to all the instance of the type product. Constants will overwrite instance properties.

## Warning

Because the whole tree structure is loaded into memory on each request this module might not be suited for big sites. So start with this module if you run into performance issues fork it and make some adjustments.

If you do think about premature optimizing your site I would like to leave you with the this message:

![batman slap](http://i.qkme.me/3rken9.jpg)
