var jungles = angular.module('jungles', []);
window.jungles = jungles;

require('./data')(jungles);
require('./events')(jungles);
require('./general')(jungles);
require('./forms')(jungles);
require('./instances')(jungles);
require('./actions')(jungles);
require('./alerts')(jungles);
