var dump = function (db, callback) {

  db.forEach(function (instance) {
    instance.order = instance.sort[instance.sort.length - 1];
  });

  callback(db);

};

module.exports = dump;
