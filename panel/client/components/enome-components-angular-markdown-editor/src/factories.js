var factories = {

  stringBuilder: function () {
    
    return function (s, selection_start, selection_end) {

      var start = s.slice(0, selection_start);
      var middle = [];
      var end = s.slice(selection_end);

      var string_builder = {

        add: function (s) {
          middle.push(s);
        },

        build: function () {

          var m = middle.join('\n');
          string_builder.length = m.length;

          if (middle.length !== 0) {
            return start + m + end;
          }

          return s;

        },

      };

      return string_builder;

    };

  },

  selection: function () {

    return {

      setRange: function (element, start, end) {

        if (element.setSelectionRange) {
          element.focus();
          element.setSelectionRange(start, end);
        } else if (element.createTextRange) {
          var range = element.createTextRange();
          range.collapse(true);
          range.moveEnd('character', end);
          range.moveStart('character', start);
          range.select();
        }
      }

    };

  }

};

module.exports = factories;
