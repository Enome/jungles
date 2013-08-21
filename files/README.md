# Jungles Files

Express app with endpoints to crud files.

## API

```js
app.use('/files', require('jungles-files')(/* path to directoy to store the files */);
```

## Mount

```js
app.use('/files', require('jungles-files')(__dirname + '/media');
```
