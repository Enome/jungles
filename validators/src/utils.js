var utils = {

  pushValue: function (obj, key, msg) {

    if (!obj[key]) {
      obj[key] = [];
    }

    obj[key].push(msg);

  },

  doWhenNotEmpty: function (val, func) {
    if (typeof val !== 'undefined' && val !== null && val !== '') {
      func();
    }
  }

};


module.exports = utils;
