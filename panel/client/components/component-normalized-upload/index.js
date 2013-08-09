
/**
 * Expose `normalize()`.
 */

module.exports = normalize;

/**
 * Get `type` from `e` on .clipboardData or .dataTransfer.
 *
 * @param {Event} e
 * @param {String} type
 * @return {Array}
 * @api private
 */

function get(e, type) {
  if (e.clipboardData) return e.clipboardData[type] || [];
  if (e.dataTransfer) return e.dataTransfer[type] || [];
  return [];
}

/**
 * Normalize `e` adding the `e.items` array and invoke `fn()`.
 *
 * @param {Event} e
 * @param {Function} fn
 * @api public
 */

function normalize(e, fn) {
  e.items = [];

  var ignore = [];
  var files = get(e, 'files');
  var items = get(e, 'items');

  normalizeItems(e, items, ignore, function(){
    normalizeFiles(e, files, ignore, function(){
      fn(e)
    });
  });
}

/**
 * Process `files`.
 *
 * Some browsers (chrome) populate both .items and .files
 * with the same things, so we need to check that the `File`
 * is not already present.
 *
 * @param {Event} e
 * @param {FileList} files
 * @param {Function} fn
 * @api private
 */

function normalizeFiles(e, files, ignore, fn) {
  var pending = files.length;

  if (!pending) return fn();

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (~ignore.indexOf(file)) continue;
    if (~e.items.indexOf(file)) continue;
    file.kind = 'file';
    e.items.push(file);
  }

  fn();
}

/**
 * Process `items`.
 *
 * @param {Event} e
 * @param {ItemList} items
 * @param {Function} fn
 * @return {Type}
 * @api private
 */

function normalizeItems(e, items, ignore, fn){
  var pending = items.length;

  if (!pending) return fn();

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    // directories
    if ('file' == item.kind && item.webkitGetAsEntry) {
      var entry = item.webkitGetAsEntry();
      if (entry && entry.isDirectory) {
        ignore.push(item.getAsFile());
        walk(e, entry, function(){
          --pending || fn(e);
        });
        continue;
      }
    }

    // files
    if ('file' == item.kind) {
      var file = item.getAsFile();
      file.kind = 'file';
      e.items.push(file);
      --pending || fn(e);
      continue;
    }

    // others
    (function(){
      var type = item.type;
      var kind = item.kind;
      item.getAsString(function(str){
        e.items.push({
          kind: kind,
          type: type,
          string: str
        });

        --pending || fn(e);
      })
    })()
  }
};

/**
 * Walk `entry`.
 *
 * @param {Event} e
 * @param {FileEntry} entry
 * @param {Function} fn
 * @api private
 */

function walk(e, entry, fn){
  if (entry.isFile) {
    return entry.file(function(file){
      file.entry = entry;
      file.kind = 'file';
      e.items.push(file);
      fn();
    })
  }

  if (entry.isDirectory) {
    var dir = entry.createReader();
    dir.readEntries(function(entries){
      entries = filterHidden(entries);
      var pending = entries.length;

      for (var i = 0; i < entries.length; i++) {
        walk(e, entries[i], function(){
          --pending || fn();
        });
      }
    })
  }
}

/**
 * Filter hidden entries.
 *
 * @param {Array} entries
 * @return {Array}
 * @api private
 */

function filterHidden(entries) {
  var arr = [];

  for (var i = 0; i < entries.length; i++) {
    if ('.' == entries[i].name[0]) continue;
    arr.push(entries[i]);
  }

  return arr;
}
