# Jungles Rest

There are two big concepts in Jungles. One is called **type** the other **instance**. A type holds all the info for creating a node that is attached to a tree. In other CMS they sometimes call this a doctype or a content-type. We just call it a type. 

The second concept (instance) is the data created by a type which lives inside a tree structure. You could call this a node but we just call it an instance.

## Types

```js
var types = {
  language: {
    root: true,
    name: 'language',
    children: [ 'page', 'projects' ],
    form: 'forms/language',
    schema: { title: [ validators.required(), validators.string() ] }
  }
};

module.exports = [ language ];
```

### Root

If this property is true then the type is a root type.

### Name

Name of the type.

### Children

These are the types that can be added to this type.  So for example: a parent type called products could have a type called 'product'.

```
Products
- Product
- Product
```

### Form

Path to your form file. Jungles uses app.render so you can use your views directory to store your forms.

### Schema

Schema property on a type is used to validate and sanitize input. By default you need to whitelist (sanitize) all your input types.

- [jungles-validation](https://github.com/Enome/Jungles/tree/master/validation)
- [jungles-validators](https://github.com/Enome/Jungles/tree/master/validators)

## Data and instances

The rest app takes a data layer to store the instances. You can create your own or use these two provided for your:

- [jungles-data-memory](https://github.com/Enome/Jungles/tree/master/data-memory)
- [jungles-data-postgres](https://github.com/Enome/Jungles/tree/master/data-postgres)


## Setup

Initialize the rest layer with the data and types.

```js
var rest = require('jungles-rest').init({ data: data, types: types });
```

## Mount

Last we'll mount it to our base application.

```js
app.use('/jungles/api', rest);
```
