var functions = {

  walkSubstack: function (stack, req, res, next) {

    if (typeof stack === 'function') {
      stack = [stack];
    }

    var walkStack = function (i, err) {

      if (err) {
        return next(err);
      }

      if (i >= stack.length) {
        return next();
      }

      stack[i](req, res, walkStack.bind(null, i + 1));

    };

    walkStack(0);

  }

};

module.exports = functions;
