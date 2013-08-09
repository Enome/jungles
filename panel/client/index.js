require('angular-markdown-textarea');
require('angular-arrangeable-array');

var jungles = window.angular.module('jungles', ['markdown-textarea', 'arrangeable-array']);
window.jungles = jungles;

require('jungles-panel-core')(jungles);
