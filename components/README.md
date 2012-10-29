# Jungles Components

Angular.js components for jungles-panel.

## Upload

```jade
upload(url='/files', ng-model='data.files')
```

### url

The component will post a base64 encode file to this url. The response should be:

```js
{ file: filename }
```

### ng-model

An array that holds filenames.
