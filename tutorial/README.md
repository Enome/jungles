# Getting started tutorial

Tutorial for [Jungles](https://github.com/Enome/jungles). You'll need to know Express.js for this tutorial.

## What are we building?

We are building a portfolio website cause blogs are boring!

## Structure

```
~Language
 |-home
 |~portfolio
 | |-project
 | |-project
 | `-project
 `-contact
```

For this website we'll need 4 different types. 

- language
- page (home & contact)
- projects 
- project

```js
git clone git@github.com:Enome/jungles-tutorial.git && cd jungles-tutorial && npm install && node app.js
```

If you have 'npm install forever -g' then you can use:

```js
git clone git@github.com:Enome/jungles-tutorial.git && cd jungles-tutorial && npm install && make server
```

# Back-end

## Setup

Create the app.js file and the package.json.

### Boilerplate

```sh
touch app.js
npm init
```

The package.json file is mainly so we can freeze our dependencies. 

### Express

```sh
npm install express --save
```

In the app.js file create an Express app and attach it to a http server.

```js
var http = require('http');
var express = require('express');

var app = express();

http.createServer(app).listen(3000);
```

Start your server to see if everything is working correctly.

```sh
node app.js
```

### Views

As of now Jungles was only tested with Jade but normally (touch wood) it should work with other engines too.

```js
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
```

Don't forget to create the directory and install Jade.

```sh
npm install jade --save
```

### Data

To make this app as portable as possible we use the jungles-data-memory module as our data access layer. You'll use your data on restarts.

```js
var data = require('jungles-data-memory')([]);
```

The array is your database so you can also specify initial data.

### Types and Instances

- A **type** is a configuration that lets you create an instance.
- An **instance** is the data that was created by a type and is part of a tree structure representing the website.

## Types

You can put your types into app.js if you want but I like to put them in a separate file.

```js
touch types.js
```

If you look at the structure of our portfolio site you see that the language node will be the first node we need.

### Root and name

```js
var language = {
  root: true,
  name: 'language',
};
```

The other types we need is page, projects and project.

```js
var page = {
  name: 'page'
};

var projects = {
  name: 'projects'
};

var project = {
  name: 'projects'
};

module.exports = [ site, page, projects, project ];
```

### Children

Use the 'children' attribute to prevent the users from adding a type to the wrong parent.

```js
var language = {
  root: true,
  name: 'language',
  children: [ 'page', 'projects' ] // can have page and projects
};

var page = {
  name: 'page'
};

var projects = {
  name: 'projects',
  children: [ 'project' ] // can have project
};

var project = {
  name: 'project'
};
```

### Forms

A type has two fields by default which you can't change: **name** and **arrange**. If you want more fields you have to define a form. The forms get rendered with app.render so we can use our views directory for storing the jade files. 

```js
var language = {
  root: true,
  name: 'language',
  children: [ 'page', 'projects' ]
};

var page = {
  name: 'page',
  form: 'forms/page'
};

var projects = {
  name: 'projects',
  children: [ 'project' ]
};

var project = {
  name: 'project',
  form: 'forms/project'
};
```

The projects type doesn't need any extra fields so we don't have to specify a form. Jungles uses app.render from the base app so you can use the views directory.

```sh
mkdir views/forms
```
Both page and project will use the same fields.

- views/forms/page.jade
- views/forms/project.jade

```jade
fieldset

  legend Data

  div
    label(for='id_body') Body
    textarea#id_body(name='body')= instance.body
```

We will add a title field to language so we can set a title for each language.

- views/forms/language.jade

```jade
fieldset

  legend Data

  div
    label(for='id_title') Title
    input#id_title(type='text', name='title', value=instance.title)
```

### Initialize

Now that our types are finished lets require them into app.js and register everything with Jungles.

```js
var data = require('jungles-data-memory')([]);
var types = require('./types');

var jungles = require('jungles').init({
  data: data,
  types: types
});

```

## Mount

```js
app.use('/jungles', jungles.app);
```

Once you did this and the server restarted you can visit /jungles. There you will have to log in or register with Mozilla Persona.

You may also notice that only arrange and name are being saved. This is because there is no validation or sanitizing yet.


## Validating and sanitizing input

The body of page and project are required so lets add validation for that.

```js
var page = {
  name: 'page',
  form: 'forms/page',
  schema: {
    body: [ validators.required() ]
  }
};

var project = {
  name: 'project',
  form: 'forms/project',
  schema: {
    body: [ validators.required() ]
  }
};
```

Now if you try to add a page or a project without a body you'll get an validation warning. You might notice that the body still doesn't get saved. That's because you need to whitelist your input. Lets add a sanitizer to body so that it gets stored.

```js
body: [ validators.required(), validators.string() ]
```

Validators can validate, sanitize or do both. Try to save a page or project it should store the body now.

## File upload

Lets add fancy pictures to our projects.

### Setup

We'll be using jungles-files-disk so we need a directory to store our files.

```sh
mkdir media
```

Store that location in a variable.

```js
var media = __dirname + '/media';
```

To serve the files we use the static middleware.

```js
app.use('/media', express.static(__dirname + '/media'));
```

Install and setup jungles-files-disk.

```sh
npm install jungles-files-disk --save
```

```js
var files = require('jungles-files-disk')(media);
```

Also need to pass it to jungles.init.

```js
var jungles = require('jungles').init({
  //...
  files: files
});
```

### Form

Add extra fields to the project.jade file.

```jade
fieldset

  legend File

  div
    label(for='id_image') Image

    if instance.image
      img(src='/media/' + instance.image, width='50', height='50')
      input(type='hidden', name='image', value=instance.image)

      label Remove
        input(type='checkbox', name='remove_image')

    input#id_image(type='file', name='image')
```

You have to name the hidden field and the file field the same so you don't reset your data when you update a project. Since the image field is optional you need a way to delete it on update. You can delete this by adding a checkbox with the same name but prepened with remove_.

As with all input fields you have to sanitize it.

```js
schema: {
  body: [ validators.required(), validators.string() ],
  image: [ validators.string() ]
}
```

# Front-end

Now that you have the back-end running we can start making the front-end of the website. You could create your own routes and just use Jungles as the data access layer. We also provide you with some middleware in the form of a module called jungles-middleware.

## Middleware

```sh
npm install jungles-middleware --save
```
Add it to your app.js file.

```js
app.get(':path(*)', require('jungles-middleware')(jungles));
```

The language type doesn't actually render something it should redirect to the first child.

```js
var language = {
  root: true,
  name: 'language',
  children: [ 'page', 'projects' ],
  middleware: function (req, res, next) {
    return res.redirect(res.locals.current.children[0].path);
  }
};
```

## Views

You might notice that Express throws 'Failed to lookup view "page"' error. By default jungles-middleware will execute type.middleware. If it doesn't find it then it will try to render a view with the name of the type. So to render home we create a page.jade file.

```shell
touch views/page.jade
```

The 'projects' type will show all the projects so we need to create a view for that as well. 

```shell
touch views/projects.jade
```

Once you have your views you can start building your website like any other Express site. Each view and middleware has the following locals available.

- **tree**: the full tree
- **current**: the current instance

## Extra

### Forever

Since you most likely want to restart your server each time you make a change use forever to auto restart.

```sh
npm install forever -g
```

Add a .foreverignore file so the server doesn't restart when those files change.

```
**/stylus/**
**/.git/**
**/media/**
```

Make a Makefile so we don't have to remember the forever command.

```sh
touch Makefile
```

I like to call the command 'server'.

```sh
server:
        @forever -w -c node app.js
```

Start the server.

```sh
make server
```
