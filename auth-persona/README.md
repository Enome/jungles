![screenshot](https://raw.github.com/Enome/jungles/master/auth-persona/screenshot.png)

Mozilla Persona Authentication app for Express.js.

## API

```js
require('jungles-auth-person')(/* optional string: template file */);
```

## Mount

```js
var app = express();
app.use('/base_url', require('jungles-auth-persona')());
```

When you visit '/base_url' you'll get a login page. Visiting '/base_url/logout' will log you out. 

## Warning

This module only does authentication you should still do authorization on logged in users. Check Jungles Auth Simple for an example.

## Test

mocha.js and should.js is needed. 

```js
make test
```
