;(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){var jungles = window.angular.module('jungles', []);

window.jungles = jungles;

require('./init')(jungles);
require('./general')(jungles);
require('./collections')(jungles);
require('./header')(jungles);
require('./alerts')(jungles);
require('./forms')(jungles);
require('./types')(jungles);
require('./instances')(jungles);
require('./icons')(jungles);
require('./clipboard')(jungles);
require('./popups')(jungles);

},{"./init":2,"./general":3,"./collections":4,"./header":5,"./alerts":6,"./forms":7,"./types":8,"./instances":9,"./icons":10,"./clipboard":11,"./popups":12}],2:[function(require,module,exports){var init = function (jungles) {

  jungles.run(function ($http, general, types) {

    var result = $http.get(general.resource_url('/types'));

    result.success(function (response) {
      types.set(response);
    });

  });

};

module.exports = init;

},{}],3:[function(require,module,exports){var factories = require('./factories');
var directives = require('./directives');
var controllers = require('./controllers');

var general = function (app) {
  app.directive('confirmClick', directives.confirmClick);
  app.directive('esckeypress', directives.esckeypress);
  app.factory('_', function () { return require('underscore'); });
  app.factory('general', factories);
  app.controller('PageCtrl', controllers.PageCtrl);
};

module.exports = general;

},{"./factories":13,"./directives":14,"./controllers":15,"underscore":16}],13:[function(require,module,exports){var jungles_functions = require('jungles-functions');

var factories = function ($document) {

  var s = {
    resource_url: function (url) {
      return $document[0].getElementById('ResourceUrl').value + url;
    },

    path: {
      parent: jungles_functions.getParent
    }

  };

  return s;

};

module.exports = factories;

},{"jungles-functions":17}],17:[function(require,module,exports){var functions = {

  getFilename: function (name) {

    var extension = name.lastIndexOf('.') === -1 ? '' : '.' + name.split('.').pop();
    var uuid = name.substring(0, 36);
    var filename = name.replace(uuid, '');

    if (filename.length === extension.length) {
      return uuid + extension;
    }

    return filename;

  },

  getParent: function (path) {

    path = path.substring(1);

    var parts = path.split('/');

    parts.pop();

    if (parts.length === 0) {
      return '/';
    }

    return '/' + parts.join('/');

  },

};

module.exports = functions;

},{}],14:[function(require,module,exports){var directives = {

  confirmClick: function ($document, $parse) {

    return {
      restrict: 'A',
      link: function ($scope, el, attr) {

        var fn = $parse(attr.confirmClick);

        var confirmed = false;

        el.bind('click', function () {

          if (confirmed) {
            $scope.$apply(function (event) {
              fn($scope, { $event: event });
            });
          }

        });

        $document.on('click', function (e) {

          $scope.$apply(function () {

            confirmed = e.target === el[0] || e.target.parentNode === el[0];
            if (!confirmed) {
              return $(el).removeClass('confirm');
            }

            $(el).addClass('confirm');

          });

        });

      }

    };

  },

  esckeypress: function ($document, $parse) {

    return {
      restrict: 'A',
      link: function ($scope, el, attr) {

        var handler = function (e) {
          if (e.which === 27) {
            $scope.$apply(function (event) {
              $parse(attr.esckeypress)($scope, { $event: event });
            });
          }
        };

        $($document).keydown(handler);

        $scope.$on('$destroy', function () {
          $($document).unbind('keydown', handler);
        });

      }

    };

  }

};

module.exports = directives;

},{}],15:[function(require,module,exports){var controllers = {

  PageCtrl: function ($scope, $location) {

    $scope.link = function (url) {
      $location.path(url);
    };

  }

};

module.exports = controllers;

},{}],16:[function(require,module,exports){(function(){//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

})()
},{}],4:[function(require,module,exports){var services = require('./services');

var collections = function (app) {
  app.factory('collections', services);
};

module.exports = collections;

},{"./services":18}],18:[function(require,module,exports){var services = function () {
  return {
    instances: [],
    types: [],
    alerts: [],
    clipboard: [],
    popups: [],
    globals: {},
  };
};

module.exports = services;

},{}],5:[function(require,module,exports){var factories = require('./factories');
var controllers = require('./controllers');

var header = function (app) {
  app.factory('header', factories);
  app.controller('HeaderCtrl', controllers.HeaderCtrl);
};

module.exports = header;

},{"./factories":19,"./controllers":20}],19:[function(require,module,exports){var factories = function () {

  return {

    pathToNavigation: function (path) {

      var root = { path: '/', name: 'Home' };

      if (path === '/') {
        return [root];
      }

      var navigation = [];

      var i;
      var parts = path.split('/');
      var path_parts = [];

      parts.forEach(function (current) {

        if (current === '') {
          navigation.push(root);
        } else {
          path_parts.push(current);
          navigation.push({ name: current, path: '/' + path_parts.join('/') });
        }

      });

      return navigation;

    }

  };

};

module.exports = factories;

},{}],20:[function(require,module,exports){var controllers = {

  HeaderCtrl: function ($scope, header, collections, general) {

    $scope.globals = collections.globals;

    $scope.$watch('globals', function () {

      if (collections.globals.path) {
        $scope.path_navigation = header.pathToNavigation(collections.globals.path);
      }

    }, true);

    $scope.back = function () {
      $scope.link(general.path.parent(collections.globals.path));
    };

  }

};

module.exports = controllers;

},{}],6:[function(require,module,exports){var factories = require('./factories');
var controllers = require('./controllers');

var alerts = function (app) {

  app.factory('alerts', factories);
  app.controller('AlertsCtrl', controllers.AlertsCtrl);

};

module.exports = alerts;

},{"./factories":21,"./controllers":22}],21:[function(require,module,exports){var factories = function () {

  return {

    flattenValidationErrors: function (errors) {

      var i;
      var flat = [];

      for (i in errors) {

        if (errors.hasOwnProperty(i)) {

          flat.push({
            type: 'error',
            name: i,
            msg: errors[i].join(', ')
          });

        }

      }

      return flat;

    }

  };

};

module.exports = factories;

},{}],22:[function(require,module,exports){var controllers = {

  AlertsCtrl: function ($scope, collections) {

    /* Format
    * var errors = [
    * { type: 'success/error', name: 'Bold text', msg: 'None bold text', keep: 'boolean' },
    * ];
    */

    $scope.alerts = collections.alerts;

    $scope.$on('$locationChangeSuccess', function () {

      var i;

      for (i = $scope.alerts.length - 1; i >= 0; i -= 1) {
        
        var current = $scope.alerts[i];

        if (!current.keep) {
          $scope.alerts.splice(i, 1);
        } else {
          current.keep = false;
        }

      }

    });

    $scope.close = function (alert) {
      collections.alerts.forEach(function (a, i) {
        if (a === alert) {
          collections.alerts.splice(i, 1);
        }
      });
    };

    // Icon

    $scope.getIcon = function (alert) {
      if (alert.type === 'success') {
        return 'icon-ok';
      }

      if (alert.type === 'error') {
        return 'icon-remove';
      }
    };

    $scope.getStyle = function (alert) {
      if (alert.type === 'success') {
        return { color: '#00B200' };
      }

      if (alert.type === 'error') {
        return { color: '#E74C3C' };
      }
    };

  }

};

module.exports = controllers;

},{}],7:[function(require,module,exports){var controllers = require('./controllers');

var forms = function (app) {
  app.controller('CreateFormCtrl', controllers.CreateFormCtrl);
  app.controller('EditFormCtrl', controllers.EditFormCtrl);

  app.config(function ($routeProvider) {

    $routeProvider.when('/new/:type/*parent', {
      controller: 'CreateFormCtrl',
      templateUrl: 'partials/form.html'
    });

    $routeProvider.when('/edit/*path', {
      controller: 'EditFormCtrl',
      templateUrl: 'partials/form.html'
    });

  });
};

module.exports = forms;

},{"./controllers":23}],23:[function(require,module,exports){var controllers = {

  CreateFormCtrl: function ($scope, $routeParams, $window, instances, collections, general, alerts, _) {

    $scope.data = {
      type: $routeParams.type,
      parent: $routeParams.parent,
      order: _.max(collections.instances, function (instance) {
        return instance.order;
      }).order + 1 || 1
    };

    $scope.path = $scope.data.parent;

    collections.globals.path = $scope.path;

    // Get Form Url

    $scope.form_url = general.resource_url('/types/' + $scope.data.type + '/form');

    // create

    $scope.submit = instances.create.push;

    // Cancel

    $scope.cancel = function () {
      $scope.link($scope.data.parent);
    };

  },

  EditFormCtrl: function ($scope, $routeParams, $window, $location, instances, general, collections, alerts, _) {

    $scope.path = $routeParams.path;
    collections.globals.path = general.path.parent($scope.path);
    
    // Get Form Url

    $scope.$watch('data.type', function (type) {
      if (typeof type !== 'undefined') {
        $scope.form_url = general.resource_url('/types/' + type + '/form');
      }
    });

    // Get current instance

    instances.get({ path: $scope.path }, function (instances) {

      var current = instances[0];

      // Data

      $scope.data = current;
      
    });

    // create

    $scope.submit = instances.update.push;

    // Cancel

    $scope.cancel = function () {
      $scope.link(general.path.parent($scope.path));
    };

  }

};

module.exports = controllers;

},{}],8:[function(require,module,exports){var controllers = require('./controllers');
var factories = require('./factories');

var types = function (app) {
  app.factory('types', factories);
  app.controller('TypesCtrl', controllers.TypesCtrl);
};

module.exports = types;

},{"./controllers":24,"./factories":25}],24:[function(require,module,exports){var controllers = {

  TypesCtrl: function ($scope, collections, types) {

    $scope.globals = collections.globals;
    $scope.types = collections.types;

    $scope.$watch('globals', function () {

      if ($scope.globals.type) {
        collections.types.length = 0;
        collections.types.push.apply(collections.types, types.get($scope.globals.type).children);
      }

    }, true);

  }

};

module.exports = controllers;

},{}],25:[function(require,module,exports){var types = [];

var factories = function () {

  return {

    set: function (data) {
      types.push.apply(types, data);
    },

    get: function (name) {
      return types.filter(function (type) {
        return type.name === name;
      })[0];
    },

  };

};

module.exports = factories;

},{}],9:[function(require,module,exports){var controllers = require('./controllers');
var factories = require('./factories');

var instances = function (app) {

  app.factory('instances', factories);
  app.controller('InstanceCtrl', controllers.InstanceCtrl);
  app.controller('InstancesCtrl', controllers.InstancesCtrl);

  app.config(function ($routeProvider, $locationProvider) {
    
    $routeProvider.when('*path', {
      controller: 'InstancesCtrl',
      templateUrl: 'partials/list.html'
    });

  });

};

module.exports = instances;

},{"./controllers":26,"./factories":27}],26:[function(require,module,exports){var InstancesCtrl = function ($scope, $routeParams, header, instances, collections, general, _) {

  $scope.path = $routeParams.path || '/';
  $scope.instances = collections.instances;
  collections.globals.path = $scope.path;

  // Current & Instances

  var re = new RegExp('^' + instances.escapeForRegex($scope.path) + '(/[^/]+$|$)');

  if ($scope.path === '/') {
    re = new RegExp('^/[^/]+$');
  }

  instances.get({ path: re }, function (response) {

    if ($scope.path === '/') {
      response.splice(0, 0, {
        name: 'root',
        type: 'root',
        path: '/',
      });
    }

    // 404

    if (response.length === 0) {
      return;
    }

    collections.globals.type = response.shift().type;
    collections.instances.length = 0;
    collections.instances.push.apply(collections.instances, response);

  });

};

var InstanceCtrl = function ($scope, instances, collections, _) {

  $scope.remove = function () {

    // UI Remove

    collections.instances.forEach(function (instance, i) {
      if (instance.path === $scope.instance.path) {
        collections.instances.splice(i, 1);
      }
    });

    // Clipboard Remove

    collections.clipboard.forEach(function (instance, i) {
      if (instance.path === $scope.instance.path) {
        collections.clipboard.splice(i, 1);
      }
    });

    // Database Remove

    instances.remove.push($scope.instance);

  };

  // Move

  $scope.clipboard = function () {

    var isAlreadyInClipboard = _.chain(collections.clipboard)
      .map(function (instance) { return instance.path; })
      .contains($scope.instance.path)
      .value();

    if (!isAlreadyInClipboard) {
      collections.clipboard.push(JSON.parse(JSON.stringify($scope.instance)));
    }
  };

};

module.exports = { InstanceCtrl: InstanceCtrl, InstancesCtrl: InstancesCtrl };

},{}],27:[function(require,module,exports){var oar = require('oar');
var qs = require('querystring');

var factories = function ($http, $rootScope, $window, $location, general, collections, alerts, _) {

  var t = {

    escapeForRegex: function (s) {
      return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },

    get: function (query, callback) {
      var key;
      for (key in query) {
        if (query.hasOwnProperty(key)) {
          if (query[key] instanceof RegExp) {
            query[key] = 'regex-' + query[key].toString();
          }
        }
      }

      var result = $http.get(general.resource_url('/instances?' + qs.stringify(query)));
      result.success(function (response) {
        callback(response);
      });
    },

    remove: oar(),
    create: oar(),
    update: oar(),
    copy: oar(),

  };

  t.remove.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.delete(general.resource_url('/instances/' + instance.path));

        result.success(function (response, status, headers, config) {

          collections.alerts.length = 0;

          collections.alerts.push({
            type: 'success',
            name: 'Removed',
            msg: _.map(response, function (instance) { return instance.path; }).join(', '),
          });

        });

      }

      instances.length = 0;

    });

  });

  t.create.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.post(general.resource_url('/instances'), instance);

        result.success(function (response, status, headers, config) {

          if (response.errors) {
            collections.alerts.length = 0;
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
            $window.scrollTo(0, 0);
            return;
          }

          collections.alerts.push({
            type: 'success',
            name: 'Created',
            msg: response[0].path,
            keep: true
          });

          $location.path(general.path.parent(response[0].path));

        });

      }

      instances.length = 0;

    });

  });

  t.update.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.put(general.resource_url('/instances'), instance);

        result.success(function (instance, response, status, headers, config) {

          collections.alerts.length = 0;

          if (response.errors) {
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
            return;
          }

          collections.alerts.push({
            type: 'success',
            name: 'Saved',
            msg: response[0].path,
            keep: instance.path !== response[0].path
          });

          $location.path('/edit/' + response[0].path);
          $window.scrollTo(0, 0);

        }.bind(null, instance));

      }

      instances.length = 0;

    });

  });

  t.copy.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.post(general.resource_url('/instances/copy'), instance);

        result.success(function (response, status, headers, config) {

          collections.alerts.length = 0;

          if (response.errors) {
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
            return;
          }

          collections.alerts.push({
            type: 'success',
            name: 'Copy',
            msg: _.map(response, function (instance) { return instance.path; }).join(', '),
          });

          collections.instances.push(response[0]);

          collections.instances.sort(function (a, b) {
            return a.sort > b.sort;
          });

        });

      }

    });

  });

  return t;

};

module.exports = factories;

},{"oar":28,"querystring":29}],28:[function(require,module,exports){(function(process){var oar = function (base) {

  var arr = base || [];
  var handlers = {};

  Object.defineProperty(arr, 'on', { value:  function (event, callback) {
    if (typeof handlers[event] === 'undefined') {
      handlers[event] = [];
    }
    handlers[event].push(callback);
  }});

  var proxy = function (method) {

    var args = Array.prototype.slice.call(arguments, 1);
    var result = Array.prototype[method].apply(arr, args);

    process.nextTick(function () {
      if (typeof handlers[method] !== 'undefined') {
        handlers[method].forEach(function (handler) {
          handler(arr);
        });
      }
    });

    return result;

  };

  [ 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift' ].forEach(function (method) {
    Object.defineProperty(arr, method, { value: proxy.bind(null, method) });
  });

  return arr;

};

module.exports = oar;

})(require("__browserify_process"))
},{"__browserify_process":30}],30:[function(require,module,exports){// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],29:[function(require,module,exports){var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    };

var objectKeys = Object.keys || function objectKeys(object) {
    if (object !== Object(object)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in object) if (object.hasOwnProperty(key)) keys[keys.length] = key;
    return keys;
}


/*!
 * querystring
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.3.1';

/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Cache non-integer test regexp.
 */

var notint = /[^0-9]/;

/**
 * Parse the given query `str`, returning an object.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};

  function promote(parent, key) {
    if (parent[key].length == 0) return parent[key] = {};
    var t = {};
    for (var i in parent[key]) t[i] = parent[key][i];
    parent[key] = t;
    return t;
  }

  return String(str)
    .split('&')
    .reduce(function(ret, pair){
      try{ 
        pair = decodeURIComponent(pair.replace(/\+/g, ' '));
      } catch(e) {
        // ignore
      }

      var eql = pair.indexOf('=')
        , brace = lastBraceInKey(pair)
        , key = pair.substr(0, brace || eql)
        , val = pair.substr(brace || eql, pair.length)
        , val = val.substr(val.indexOf('=') + 1, val.length)
        , parent = ret;

      // ?foo
      if ('' == key) key = pair, val = '';

      // nested
      if (~key.indexOf(']')) {
        var parts = key.split('[')
          , len = parts.length
          , last = len - 1;

        function parse(parts, parent, key) {
          var part = parts.shift();

          // end
          if (!part) {
            if (isArray(parent[key])) {
              parent[key].push(val);
            } else if ('object' == typeof parent[key]) {
              parent[key] = val;
            } else if ('undefined' == typeof parent[key]) {
              parent[key] = val;
            } else {
              parent[key] = [parent[key], val];
            }
          // array
          } else {
            obj = parent[key] = parent[key] || [];
            if (']' == part) {
              if (isArray(obj)) {
                if ('' != val) obj.push(val);
              } else if ('object' == typeof obj) {
                obj[objectKeys(obj).length] = val;
              } else {
                obj = parent[key] = [parent[key], val];
              }
            // prop
            } else if (~part.indexOf(']')) {
              part = part.substr(0, part.length - 1);
              if(notint.test(part) && isArray(obj)) obj = promote(parent, key);
              parse(parts, obj, part);
            // key
            } else {
              if(notint.test(part) && isArray(obj)) obj = promote(parent, key);
              parse(parts, obj, part);
            }
          }
        }

        parse(parts, parent, 'base');
      // optimize
      } else {
        if (notint.test(key) && isArray(parent.base)) {
          var t = {};
          for(var k in parent.base) t[k] = parent.base[k];
          parent.base = t;
        }
        set(parent.base, key, val);
      }

      return ret;
    }, {base: {}}).base;
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix;
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[]'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;
  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    ret.push(stringify(obj[key], prefix
      ? prefix + '[' + encodeURIComponent(key) + ']'
      : encodeURIComponent(key)));
  }
  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

},{}],10:[function(require,module,exports){var icons = function (app) {

  app.controller('IconCtrl', function ($scope, types, _) {

    var base = {
      name: 'icon-file',
      color: 'inherit',
    };

    $scope.getIcon = function (name) {
      var type = _.extend(base, types.get(name).icon);
      return type.name;
    };

    $scope.getStyle = function (name) {
      var type = _.extend(base, types.get(name).icon);
      return { color: type.color };
    };

  });

};

module.exports = icons;

},{}],11:[function(require,module,exports){var factories = require('./factories');
var controllers = require('./controllers');

var move = function (app) {
  app.factory('clipboard', factories);
  app.controller('ClipboardCtrl', controllers.ClipboardCtrl);
  app.controller('ClipboardInstanceCtrl', controllers.ClipboardInstanceCtrl);
  app.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);
};

module.exports = move;

},{"./factories":31,"./controllers":32}],31:[function(require,module,exports){var factories = function (collections) {

  
  return {

    clear: function (instance) {

      collections.clipboard.forEach(function (instance, i) {
        if (collections.clipboard[i].path === instance.path) {
          collections.clipboard.splice(i, 1);
        }
      });

    }

  };

};

module.exports = factories;

},{}],32:[function(require,module,exports){var controllers = {

  ClipboardCtrl: function ($scope, collections) {
    $scope.clipboard = collections.clipboard;
  },

  ClipboardInstanceCtrl: function ($scope, $window, collections, alerts, instances, clipboard, _) {

    $scope.clear = clipboard.clear;

    $scope.canCopy = function () {
      return _.contains(collections.types, $scope.instance.type);
    };

    $scope.canCopyText = function () {
      if ($scope.canCopy()) {
        return 'Copy here';
      }

      return 'Cannot copy here';
    };

    $scope.copy = function () {

      var copy = JSON.parse(JSON.stringify($scope.instance));
      var is_already_in_instances = _.chain(collections.instances)
        .map(function (instance) { return instance.name.toLowerCase(); })
        .contains(copy.name.toLowerCase())
        .value();
        
      copy.parent = collections.globals.path;
      copy.order = _.max(collections.instances, function (instance) {
        return instance.order;
      }).order + 1 || 1;

      // Name doesn't exist at this level

      if (!is_already_in_instances) {
        $scope.clear();
        return instances.copy.push(copy);
      }

      // Pass it to popup

      return collections.popups.push({ type: 'copy', data: copy });

    };

  },

};

module.exports = controllers;

},{}],12:[function(require,module,exports){var controllers = require('./controllers');

var popups = function (jungles) {
  jungles.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);
};

module.exports = popups;

},{"./controllers":33}],33:[function(require,module,exports){var controllers = {

  CopyPopupCtrl: function ($scope, collections, instances, clipboard, _) {

    $scope.popups = collections.popups;
    $scope.show = false;
    $scope.data = { name: '' };

    $scope.$watch('popups', function () {
      $scope.popups.forEach(function (popup) {
        if (popup.type === 'copy') {
          $scope.show = true;
          $scope.data = popup.data;
        }
      });
    }, true);

    $scope.validate = function (form_invalid, new_name) {
      var name_already_exists = _.chain(collections.instances)
        .map(function (instance) { return instance.name.toLowerCase(); })
        .contains((new_name || '').toLowerCase())
        .value();

      return form_invalid || name_already_exists;
    };

    $scope.rename = function () {
      $scope.data.name = $scope.new_name;
      $scope.new_name = '';
      clipboard.clear($scope.data);
      instances.copy.push($scope.data);
      $scope.close();
    };

    $scope.close = function () {
      collections.popups.length = 0;
      $scope.show = false;
    };

  }

};

module.exports = controllers;

},{}]},{},[1]);