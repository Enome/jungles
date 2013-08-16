var jungles = window.angular.module('jungles', [
  require('angular-markdown-textarea'),
  require('angular-arrangeable-files')
]);

window.jungles = jungles;

require('jungles-panel-core')(jungles);
