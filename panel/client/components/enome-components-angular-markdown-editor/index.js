require('webfont');
require('angular-file-manager');

var module = window.angular.module('markdown-editor', ['file-manager']);

module.run(['$templateCache', function ($templateCache) {
  window.WebFont.load({ google: { families: ['Open Sans:300,400,700', 'Droid Serif:400'] } });
}]);

var directives = require('./src/directives');
var controllers = require('./src/controllers');
var filters = require('./src/filters');
var factories = require('./src/factories');

module.directive('markdownEditor', directives.markdownEditor);
module.controller('MarkdownEditorCtrl', controllers.MarkdownEditorCtrl);
module.filter('markdown', filters.markdown);
module.factory('stringBuilder', factories.stringBuilder);
module.factory('selection', factories.selection);
