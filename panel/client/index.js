var jungles = window.angular.module('jungles', []);

window.jungles = jungles;

require('./init')(jungles);
require('./general')(jungles);
require('./collections')(jungles);
require('./header')(jungles);
require('./alerts')(jungles);
require('./forms')(jungles);
require('./types')(jungles);
require('./instances')(jungles);
require('./icons')(jungles);
require('./clipboard')(jungles);
require('./popups')(jungles);
