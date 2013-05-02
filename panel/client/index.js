var jungles = angular.module('jungles', []);
window.jungles = jungles;

require('./data')(jungles);
require('./collections')(jungles);
require('./general')(jungles);
require('./header')(jungles);
require('./alerts')(jungles);
require('./forms')(jungles);
require('./types')(jungles);
require('./instances')(jungles);
