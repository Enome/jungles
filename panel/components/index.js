var fs = require('fs');
var component = require('component-wrapper');

var components = function (options) {

  var components_json = require('./component_default.json');
  var main_js = fs.readFileSync(__dirname + '/main_default.js').toString();

  components_json.dependencies = options.dependencies || {};

  var requires = '';
  var key;

  for (key in options.dependencies) {

    if (options.dependencies.hasOwnProperty(key)) {
      requires += 'require("' + key.split('/').pop() + '");\n';
    }

  }

  console.log(requires);

  main_js = main_js.replace('/* requires */', requires);
  main_js = main_js.replace('/* modules */', '"' + options.angular_modules.join('","') + '"');

  console.log('---------------------------------------------');
  console.log(main_js);
  console.log('---------------');
  console.log(components_json);
  console.log('---------------------------------------------');

  fs.writeFileSync(__dirname + '/component.json', JSON.stringify(components_json));
  fs.writeFileSync(__dirname + '/main.js', main_js);

  component([ [ 'install' ], [ 'build', '-v' ] ], { cwd: __dirname });

};

module.exports = components;
