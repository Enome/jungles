var middleware = require('./middleware');

module.exports = function (jungles) {
  return [
    middleware.tree(jungles.core.data),
    middleware.current,
    middleware.type(jungles.core.types),
    middleware.middleware,
    middleware.render
  ];
};
