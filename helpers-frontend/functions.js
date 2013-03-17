var functions = {

  isPartOfUrl: function (node_path, current_path) {

    var node_parts = node_path.split('/');
    var current_parts = current_path.split('/');

    var match = true;

    node_parts.forEach(function (node_part, i) {
      
      if (node_part !== current_parts[i]) {
        match = false;
      }

    });

    return match;

  }

};

module.exports = functions;
