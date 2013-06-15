# Jungles Rest

There are two big concepts in Jungles. One is called **type** the other **instance**. A type holds all the info for creating a node that is attached to a tree. In other CMS they sometimes call this a doctype or a content-type. We just call it a type. 

The second concept (instance) is the data created by a type which lives inside a tree structure.

## Types

```js
var types = [

  {
    root: {
    name: 'root',
    children: [ 'language' ]
  },

  {
    name: 'language',
    children: [ 'page', 'projects' ],
    form: 'forms/language',
    schema: { title: [ validators.required(), validators.string() ] }
  }

];
```

### Root

The root type is a special one because it doesn't actually have data (instance) that lives in the content tree. It's only use is to set children that you can add at the root level. So if you don't define a root type you can't create instances because there is no starting point.

### Name

Name of the type.

### Children

These are the types that can be added to this type.  So for example: a parent type called `Products` could have a type called `Product`. The `Products` type in this case can be viewed as a container to hold products and most likely wont have any form.

```
Products
- Product
- Product
```

Types can also include themself as a child. For example you could make a `Page` type that can contain a `Page` child and created an endless tree of pages.

```
Page
- Page
-- Page
--- ...
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
var rest = require('jungles-rest')({ data: data, types: types });
```

This returns an Express.js app. You can find the data later and types at:

```js
rest.core.data;
rest.core.types;
```

## Mount

Last we'll mount it to our base application.

```js
app.use('/jungles/api', rest);
```
