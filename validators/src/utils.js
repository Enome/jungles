var utils = {

  pushValue: function (obj, key, msg) {

    if (!obj[key]) {
      obj[key] = [];
    }

    obj[key].push(msg);

  }

};


module.exports = utils;
