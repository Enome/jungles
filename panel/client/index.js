var jungles = angular.module('jungles', []);

require('./data')(jungles);
require('./events')(jungles);
require('./general')(jungles);
require('./forms')(jungles);
require('./instances')(jungles);
require('./actions')(jungles);
require('./errors')(jungles);
