# Jungles Components

Angular.js components for jungles-panel.

## Upload

```jade
upload(url='/files', ng-model='data.files')
```

### url

The component will post a data url encode file to this url. The body of the request should be:

```js
{ file: 'DataUrl' }
```

 The response should be:

```js
{ file: filename }
```

### ng-model

An array that holds filenames.


## Install

You can install the Angular.js components by passing them to the Jungles Panel.

```js
var panel = require('jungles-panel').init({
  ...
  customize: [ require('jungles-components').upload ],
});
```

If you want to create your own components check out the component structure at [Jungles Panel](https://github.com/Enome/jungles/tree/master/panel#component-structure)
