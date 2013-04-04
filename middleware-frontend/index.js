var middleware = require('./middleware');

module.exports = function (jungles) {
  return [
    middleware.tree(jungles.core.data),
    middleware.current,
    middleware.type(jungles.core.schemas),
    middleware.constants(jungles.core.schemas),
    middleware.middleware,
    middleware.render
  ];
};
