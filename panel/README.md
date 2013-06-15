# Jungles Panel

Control panel for Jungles. It's a single page app for that uses Angular.js.

## API

```js
var panel = require('jungles-panel')({ 
  url: /* string: url to jungles-rest */, 
  customize: /* array: with component end-points */, 
});
```

## Setup

```js
var panel = require('jungles-panel')({
  url: '/jungles/api',
  customize: [ require('jungles-components').upload ],
});
```

### Url

This is the url pointing to the API where it should get the data. In most cases this will be Jungles Rest.

### Customize

Use this to add extra angular.js components to Jungles Panel. Components can have javascript, css and assets (images, html, ...).

The js and css files are merged into one file at:

```
/baseurl/customize/javascript
/baseurl/customize/css
```

The assets are served at:

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

## Icons

If you like to set a custom icon on your type you can use the following code:

```js
var type = {
  name: 'picture',
  icon: {
    name: 'icon-picture',
    color: '#000000',
  }
};
```

For icons we use the awesome font [fontawesome (3.2.0)](http://fortawesome.github.io/Font-Awesome/icons/). The color is a css color value. Icon, name and color are all optional and will default to a gray icon-file icon.

## Forms

Angular.js supports html5 input attributes so you can add `required`, `type='email'`, ... If a form isn't valid on the client you wont be able to click the save button. 
