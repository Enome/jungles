# Jungles Auth Simple

Simple authorization middleware. If a req.session.user is in the administrator array the request will get nexted otherwise you get redirected to the login string.

## API

```js
require('jungles-auth-simple')(/* string: login url */, /* array: [res.session.user] */)
```

## Mount

```js
var app = express();
app.use('/administrator', require('jungles-auth-simple')('/login', ['geert.pasteels@gmail.com']));     
```

## Warning

This module only does authorization you still need authentication middleware that sets a req.session.user. Jungles Auth Persona is an example of such using Mozilla Persona.

## Test

mocha.js and should.js is needed. 

```js
make test
```
