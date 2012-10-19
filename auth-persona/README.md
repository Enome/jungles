![screenshot](https://raw.github.com/Enome/jungles-auth-persona/master/screenshot.png)

Mozilla Persona Authentication app for Express.js. This app is developed for Jungles but can be used with any Express.js application. In case you didn't know: Express.js allows you to break your project into small apps which you can mount onto a base app.

## Mount

```js
var auth = require('jungles-authentication-persona');
var app = express(); // Your app
app.mount(auth.init('/admin*'));
```

This will redirect to the /login if session.user is undefined and the user visits /admin*. If you need multiple urls you can pass an array.

## Test

mocha.js and should.js is needed.

```js
make test
```
