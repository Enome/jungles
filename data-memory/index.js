module.exports = function (db) {

  return {
    find: require('./find').bind(null, db),
    create: require('./create').bind(null, db),
    update: require('./update').bind(null, db),
    tree: require('./tree').bind(null, db),
    remove: require('./remove').bind(null, db)
  };

};
