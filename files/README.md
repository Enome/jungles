# Jungles Files

Express app with two endpoints to store and serve files.

## Mount

```js
app.use('/files', require('jungles-files')(__dirname + '/media'); // Param: directory to store the files
```

## POST/:filename

Expects req.body.file to be a data url. It will rename the file to uuid.extension, store the file in the directory and response with:

```js
{ filename: uuid.extension }
```

## GET/:filename

Returns the file.
