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

This is where you installed jungles-rest.

### Customize

Use this to add extra angular.js controls that you can use in your forms. Components can have javascript, css and add extra pages. 

The javascript and css is merged into one file and can be found at:

```
/baseurl/customize/javascript
/baseurl/customize/css
```

The html can be found at:

```
/baseurl/customize/:name
```

#### Component structure:

```js
var component = {
  javascript: 'alert("test");',
  css: 'body { color: red; }',
  html: [
    {
      name: 'home',
      html: '<h1>Hello? yes, this is dog.</h1>'
    }
  ]
};
```

## Mount

```js
app.use('/jungles', panel)
```
