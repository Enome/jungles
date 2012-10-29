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
