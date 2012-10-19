# Jungles (status: unstable)

This is the core module for Jungles which is a cms for express.js developers. This module mainly takes care of adding data and providing a back-end.

## Want to help out?

If you want to help out you can mostly find me in #jungles on freenode (ping pickels) or create an issue here on Github. Feel free to contact to me to share some ideas/code.

## Tutorial

If you are looking for a tutorial check out [jungles-tutorial](https://github.com/Enome/jungles-tutorial).

The tutorial has an example site you can try.

```sh
git clone git@github.com:Enome/jungles-tutorial.git && cd jungles-tutorial && npm install && node app.js
```

## Initialize

```js
// Setup
var data = require('jungles-data-memory')([]);
var types = require('./types');

var jungles = require('jungles').init({
  data: data,
  types: types
});

// Mount
app.use('/jungles', jungles.app);
```

## Data

This module is pass to Jungles and used as the data access layer.

- [jungles-data-memory](http://github.com/Enome/jungles-data-memory)
- [jungles-data-postgres](http://github.com/Enome/jungles-data-postgres)

## Files

This module is passed to Jungles and used as to store files.

- [jungles-files-disk](http://github.com/Enome/jungles-files-disk)

## Types

```js
var language = {
  root: true,
  name: 'language',
  children: [ 'page', 'projects' ],
  form: 'forms/language',
  schema: {
    title: [ validators.required(), validators.string() ]
  }
};

module.exports = [ laguange ];
```

### Root

If property is true then the type is a root type.

### Name

Name of the type.

### Children

Children property is an array to whitelist which children are allowed to this type.

### Form

Form is the form that is used to input data into the back-end. Jungles uses app.render so you can use your views directory to store your forms.

### Schema

Schema property on a type is used to validate and sanitize input. By default you need to whitelist all your input types.

- [jungles-validation](http://github.com/Enome/jungles-validation)
- [jungles-validators](http://github.com/Enome/jungles-validators)

### Mount

Jungles.app is an app you can mount to your express.js app.

## Font-end

The front-end is your own express app. You can create your own middleware and routes with Jungles but we also provide one

- [jungles-middleware](http://github.com/Enome/jungles-middleware)

## Helpers & Helper modules

- [jungles-helpers](http://github.com/Enome/jungles-helpers)
- [kwery: query arrays and trees](http://github.com/Enome/kwery)
