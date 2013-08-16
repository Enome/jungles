require('webfont');

var mod = window.angular.module('markdown-editor', [
  require('angular-file-manager')
]);

mod.run(['$templateCache', function ($templateCache) {
  window.WebFont.load({ google: { families: ['Open Sans:300,400,700', 'Droid Serif:400'] } });
}]);

var directives = require('./src/directives');
var controllers = require('./src/controllers');
var filters = require('./src/filters');
var factories = require('./src/factories');

mod.directive('markdownEditor', directives.markdownEditor);
mod.controller('MarkdownEditorCtrl', controllers.MarkdownEditorCtrl);
mod.filter('markdown', filters.markdown);
mod.factory('stringBuilder', factories.stringBuilder);
mod.factory('selection', factories.selection);

module.exports = 'markdown-editor';
