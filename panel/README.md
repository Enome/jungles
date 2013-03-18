# Jungles Panel

Control panel for Jungles. It's a single page app for that uses Angular.js.

## Setup

```js
var panel = require('jungles-panel').init({
  url: '/jungles/api',
  customize: [ require('jungles-components').upload ],
});
```

### Url

This is the url pointing to the API where it should get the data. In most cases this will be Jungles Rest.

### Customize

Use this to add extra angular.js components to Jungles Panel. Components can have javascript, css and assets (images, html, ...).

The js and css files are merged into one file and can be found at:

```
/baseurl/customize/javascript
/baseurl/customize/css
```

The assets can be found at:

```
/baseurl/customize/:componentname/:file
```

#### Component structure:

```js
var component = {
  name: 'componentname',
  javascript: __dirname + '/file.js',
  css: __dirname + '/file.css',
  assets: __dirname + '/directory
};
```

In your components you can access the global Jungles Panel app with:

```js
var app = window.jungles;

app.filter('your_filter', ...);
app.factory('your_factory', ...);
app.controller('your_controller', ...);
app.directive('your_directive', ...);
```

## Mount

```js
app.use('/jungles', panel)
```
