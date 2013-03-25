# Jungles Files

Express app with two endpoints to store and serve files.

## Mount

```js
app.use('/files', require('jungles-files')(__dirname + '/media');
```

This will store your files in the __dirname/media directory.

## POST/:filename

Expects req.body.file to be a data url. It will rename the file to uuid+filename.extension, store the file in the directory and response with:

```js
{ filename: uuid+filename.extension }
```

## GET/:filename

This will serve the file with the matching filename. If a ?downloadquerystring is defined then it will add an attachment header with the filename - the uuid.
