var validators = require('jungles-validators');

var language = {
  root: true,
  name: 'language',
  children: [ 'page', 'projects' ],
  form: 'forms/language',
  middleware: function (req, res, next) {
    return res.redirect(res.locals.current.children[0].path);
  },
  schema: {
    title: [ validators.required(), validators.string() ]
  }
};

var page = {
  name: 'page',
  form: 'forms/page',
  schema: {
    body: [ validators.required(), validators.string() ]
  }
};

var projects = {
  name: 'projects',
  children: [ 'project' ]
};

var project = {
  name: 'project',
  form: 'forms/project',
  schema: {
    body: [ validators.required(), validators.string() ],
    image: [ validators.string() ]
  }
};

module.exports = [ language, page, projects, project ];
