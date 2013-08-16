
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};

require.register("component-marked/lib/marked.js", Function("exports, require, module",
"/**\n\
 * marked - a markdown parser\n\
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)\n\
 * https://github.com/chjj/marked\n\
 */\n\
\n\
;(function() {\n\
\n\
/**\n\
 * Block-Level Grammar\n\
 */\n\
\n\
var block = {\n\
  newline: /^\\n\
+/,\n\
  code: /^( {4}[^\\n\
]+\\n\
*)+/,\n\
  fences: noop,\n\
  hr: /^( *[-*_]){3,} *(?:\\n\
+|$)/,\n\
  heading: /^ *(#{1,6}) *([^\\n\
]+?) *#* *(?:\\n\
+|$)/,\n\
  nptable: noop,\n\
  lheading: /^([^\\n\
]+)\\n\
 *(=|-){3,} *\\n\
*/,\n\
  blockquote: /^( *>[^\\n\
]+(\\n\
[^\\n\
]+)*\\n\
*)+/,\n\
  list: /^( *)(bull) [\\s\\S]+?(?:hr|\\n\
{2,}(?! )(?!\\1bull )\\n\
*|\\s*$)/,\n\
  html: /^ *(?:comment|closed|closing) *(?:\\n\
{2,}|\\s*$)/,\n\
  def: /^ *\\[([^\\]]+)\\]: *([^\\s]+)(?: +[\"(]([^\\n\
]+)[\")])? *(?:\\n\
+|$)/,\n\
  table: noop,\n\
  paragraph: /^([^\\n\
]+\\n\
?(?!hr|heading|lheading|blockquote|tag|def))+\\n\
*/,\n\
  text: /^[^\\n\
]+/\n\
};\n\
\n\
block.bullet = /(?:[*+-]|\\d+\\.)/;\n\
block.item = /^( *)(bull) [^\\n\
]*(?:\\n\
(?!\\1bull )[^\\n\
]*)*/;\n\
block.item = replace(block.item, 'gm')\n\
  (/bull/g, block.bullet)\n\
  ();\n\
\n\
block.list = replace(block.list)\n\
  (/bull/g, block.bullet)\n\
  ('hr', /\\n\
+(?=(?: *[-*_]){3,} *(?:\\n\
+|$))/)\n\
  ();\n\
\n\
block._tag = '(?!(?:'\n\
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'\n\
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'\n\
  + '|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:/|@)\\\\b';\n\
\n\
block.html = replace(block.html)\n\
  ('comment', /<!--[\\s\\S]*?-->/)\n\
  ('closed', /<(tag)[\\s\\S]+?<\\/\\1>/)\n\
  ('closing', /<tag(?:\"[^\"]*\"|'[^']*'|[^'\">])*?>/)\n\
  (/tag/g, block._tag)\n\
  ();\n\
\n\
block.paragraph = replace(block.paragraph)\n\
  ('hr', block.hr)\n\
  ('heading', block.heading)\n\
  ('lheading', block.lheading)\n\
  ('blockquote', block.blockquote)\n\
  ('tag', '<' + block._tag)\n\
  ('def', block.def)\n\
  ();\n\
\n\
/**\n\
 * Normal Block Grammar\n\
 */\n\
\n\
block.normal = merge({}, block);\n\
\n\
/**\n\
 * GFM Block Grammar\n\
 */\n\
\n\
block.gfm = merge({}, block.normal, {\n\
  fences: /^ *(`{3,}|~{3,}) *(\\w+)? *\\n\
([\\s\\S]+?)\\s*\\1 *(?:\\n\
+|$)/,\n\
  paragraph: /^/\n\
});\n\
\n\
block.gfm.paragraph = replace(block.paragraph)\n\
  ('(?!', '(?!' + block.gfm.fences.source.replace('\\\\1', '\\\\2') + '|')\n\
  ();\n\
\n\
/**\n\
 * GFM + Tables Block Grammar\n\
 */\n\
\n\
block.tables = merge({}, block.gfm, {\n\
  nptable: /^ *(\\S.*\\|.*)\\n\
 *([-:]+ *\\|[-| :]*)\\n\
((?:.*\\|.*(?:\\n\
|$))*)\\n\
*/,\n\
  table: /^ *\\|(.+)\\n\
 *\\|( *[-:]+[-| :]*)\\n\
((?: *\\|.*(?:\\n\
|$))*)\\n\
*/\n\
});\n\
\n\
/**\n\
 * Block Lexer\n\
 */\n\
\n\
function Lexer(options) {\n\
  this.tokens = [];\n\
  this.tokens.links = {};\n\
  this.options = options || marked.defaults;\n\
  this.rules = block.normal;\n\
\n\
  if (this.options.gfm) {\n\
    if (this.options.tables) {\n\
      this.rules = block.tables;\n\
    } else {\n\
      this.rules = block.gfm;\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Expose Block Rules\n\
 */\n\
\n\
Lexer.rules = block;\n\
\n\
/**\n\
 * Static Lex Method\n\
 */\n\
\n\
Lexer.lex = function(src, options) {\n\
  var lexer = new Lexer(options);\n\
  return lexer.lex(src);\n\
};\n\
\n\
/**\n\
 * Preprocessing\n\
 */\n\
\n\
Lexer.prototype.lex = function(src) {\n\
  src = src\n\
    .replace(/\\r\\n\
|\\r/g, '\\n\
')\n\
    .replace(/\\t/g, '    ')\n\
    .replace(/\\u00a0/g, ' ')\n\
    .replace(/\\u2424/g, '\\n\
');\n\
\n\
  return this.token(src, true);\n\
};\n\
\n\
/**\n\
 * Lexing\n\
 */\n\
\n\
Lexer.prototype.token = function(src, top) {\n\
  var src = src.replace(/^ +$/gm, '')\n\
    , next\n\
    , loose\n\
    , cap\n\
    , item\n\
    , space\n\
    , i\n\
    , l;\n\
\n\
  while (src) {\n\
    // newline\n\
    if (cap = this.rules.newline.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      if (cap[0].length > 1) {\n\
        this.tokens.push({\n\
          type: 'space'\n\
        });\n\
      }\n\
    }\n\
\n\
    // code\n\
    if (cap = this.rules.code.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      cap = cap[0].replace(/^ {4}/gm, '');\n\
      this.tokens.push({\n\
        type: 'code',\n\
        text: !this.options.pedantic\n\
          ? cap.replace(/\\n\
+$/, '')\n\
          : cap\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // fences (gfm)\n\
    if (cap = this.rules.fences.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.push({\n\
        type: 'code',\n\
        lang: cap[2],\n\
        text: cap[3]\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // heading\n\
    if (cap = this.rules.heading.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.push({\n\
        type: 'heading',\n\
        depth: cap[1].length,\n\
        text: cap[2]\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // table no leading pipe (gfm)\n\
    if (top && (cap = this.rules.nptable.exec(src))) {\n\
      src = src.substring(cap[0].length);\n\
\n\
      item = {\n\
        type: 'table',\n\
        header: cap[1].replace(/^ *| *\\| *$/g, '').split(/ *\\| */),\n\
        align: cap[2].replace(/^ *|\\| *$/g, '').split(/ *\\| */),\n\
        cells: cap[3].replace(/\\n\
$/, '').split('\\n\
')\n\
      };\n\
\n\
      for (i = 0; i < item.align.length; i++) {\n\
        if (/^ *-+: *$/.test(item.align[i])) {\n\
          item.align[i] = 'right';\n\
        } else if (/^ *:-+: *$/.test(item.align[i])) {\n\
          item.align[i] = 'center';\n\
        } else if (/^ *:-+ *$/.test(item.align[i])) {\n\
          item.align[i] = 'left';\n\
        } else {\n\
          item.align[i] = null;\n\
        }\n\
      }\n\
\n\
      for (i = 0; i < item.cells.length; i++) {\n\
        item.cells[i] = item.cells[i].split(/ *\\| */);\n\
      }\n\
\n\
      this.tokens.push(item);\n\
\n\
      continue;\n\
    }\n\
\n\
    // lheading\n\
    if (cap = this.rules.lheading.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.push({\n\
        type: 'heading',\n\
        depth: cap[2] === '=' ? 1 : 2,\n\
        text: cap[1]\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // hr\n\
    if (cap = this.rules.hr.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.push({\n\
        type: 'hr'\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // blockquote\n\
    if (cap = this.rules.blockquote.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
\n\
      this.tokens.push({\n\
        type: 'blockquote_start'\n\
      });\n\
\n\
      cap = cap[0].replace(/^ *> ?/gm, '');\n\
\n\
      // Pass `top` to keep the current\n\
      // \"toplevel\" state. This is exactly\n\
      // how markdown.pl works.\n\
      this.token(cap, top);\n\
\n\
      this.tokens.push({\n\
        type: 'blockquote_end'\n\
      });\n\
\n\
      continue;\n\
    }\n\
\n\
    // list\n\
    if (cap = this.rules.list.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
\n\
      this.tokens.push({\n\
        type: 'list_start',\n\
        ordered: isFinite(cap[2])\n\
      });\n\
\n\
      // Get each top-level item.\n\
      cap = cap[0].match(this.rules.item);\n\
\n\
      next = false;\n\
      l = cap.length;\n\
      i = 0;\n\
\n\
      for (; i < l; i++) {\n\
        item = cap[i];\n\
\n\
        // Remove the list item's bullet\n\
        // so it is seen as the next token.\n\
        space = item.length;\n\
        item = item.replace(/^ *([*+-]|\\d+\\.) +/, '');\n\
\n\
        // Outdent whatever the\n\
        // list item contains. Hacky.\n\
        if (~item.indexOf('\\n\
 ')) {\n\
          space -= item.length;\n\
          item = !this.options.pedantic\n\
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')\n\
            : item.replace(/^ {1,4}/gm, '');\n\
        }\n\
\n\
        // Determine whether item is loose or not.\n\
        // Use: /(^|\\n\
)(?! )[^\\n\
]+\\n\
\\n\
(?!\\s*$)/\n\
        // for discount behavior.\n\
        loose = next || /\\n\
\\n\
(?!\\s*$)/.test(item);\n\
        if (i !== l - 1) {\n\
          next = item[item.length-1] === '\\n\
';\n\
          if (!loose) loose = next;\n\
        }\n\
\n\
        this.tokens.push({\n\
          type: loose\n\
            ? 'loose_item_start'\n\
            : 'list_item_start'\n\
        });\n\
\n\
        // Recurse.\n\
        this.token(item, false);\n\
\n\
        this.tokens.push({\n\
          type: 'list_item_end'\n\
        });\n\
      }\n\
\n\
      this.tokens.push({\n\
        type: 'list_end'\n\
      });\n\
\n\
      continue;\n\
    }\n\
\n\
    // html\n\
    if (cap = this.rules.html.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.push({\n\
        type: this.options.sanitize\n\
          ? 'paragraph'\n\
          : 'html',\n\
        pre: cap[1] === 'pre',\n\
        text: cap[0]\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // def\n\
    if (top && (cap = this.rules.def.exec(src))) {\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.links[cap[1].toLowerCase()] = {\n\
        href: cap[2],\n\
        title: cap[3]\n\
      };\n\
      continue;\n\
    }\n\
\n\
    // table (gfm)\n\
    if (top && (cap = this.rules.table.exec(src))) {\n\
      src = src.substring(cap[0].length);\n\
\n\
      item = {\n\
        type: 'table',\n\
        header: cap[1].replace(/^ *| *\\| *$/g, '').split(/ *\\| */),\n\
        align: cap[2].replace(/^ *|\\| *$/g, '').split(/ *\\| */),\n\
        cells: cap[3].replace(/(?: *\\| *)?\\n\
$/, '').split('\\n\
')\n\
      };\n\
\n\
      for (i = 0; i < item.align.length; i++) {\n\
        if (/^ *-+: *$/.test(item.align[i])) {\n\
          item.align[i] = 'right';\n\
        } else if (/^ *:-+: *$/.test(item.align[i])) {\n\
          item.align[i] = 'center';\n\
        } else if (/^ *:-+ *$/.test(item.align[i])) {\n\
          item.align[i] = 'left';\n\
        } else {\n\
          item.align[i] = null;\n\
        }\n\
      }\n\
\n\
      for (i = 0; i < item.cells.length; i++) {\n\
        item.cells[i] = item.cells[i]\n\
          .replace(/^ *\\| *| *\\| *$/g, '')\n\
          .split(/ *\\| */);\n\
      }\n\
\n\
      this.tokens.push(item);\n\
\n\
      continue;\n\
    }\n\
\n\
    // top-level paragraph\n\
    if (top && (cap = this.rules.paragraph.exec(src))) {\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.push({\n\
        type: 'paragraph',\n\
        text: cap[0]\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // text\n\
    if (cap = this.rules.text.exec(src)) {\n\
      // Top-level should never reach here.\n\
      src = src.substring(cap[0].length);\n\
      this.tokens.push({\n\
        type: 'text',\n\
        text: cap[0]\n\
      });\n\
      continue;\n\
    }\n\
\n\
    if (src) {\n\
      throw new\n\
        Error('Infinite loop on byte: ' + src.charCodeAt(0));\n\
    }\n\
  }\n\
\n\
  return this.tokens;\n\
};\n\
\n\
/**\n\
 * Inline-Level Grammar\n\
 */\n\
\n\
var inline = {\n\
  escape: /^\\\\([\\\\`*{}\\[\\]()#+\\-.!_>|])/,\n\
  autolink: /^<([^ >]+(@|:\\/)[^ >]+)>/,\n\
  url: noop,\n\
  tag: /^<!--[\\s\\S]*?-->|^<\\/?\\w+(?:\"[^\"]*\"|'[^']*'|[^'\">])*?>/,\n\
  link: /^!?\\[(inside)\\]\\(href\\)/,\n\
  reflink: /^!?\\[(inside)\\]\\s*\\[([^\\]]*)\\]/,\n\
  nolink: /^!?\\[((?:\\[[^\\]]*\\]|[^\\[\\]])*)\\]/,\n\
  strong: /^__([\\s\\S]+?)__(?!_)|^\\*\\*([\\s\\S]+?)\\*\\*(?!\\*)/,\n\
  em: /^\\b_((?:__|[\\s\\S])+?)_\\b|^\\*((?:\\*\\*|[\\s\\S])+?)\\*(?!\\*)/,\n\
  code: /^(`+)([\\s\\S]*?[^`])\\1(?!`)/,\n\
  br: /^ {2,}\\n\
(?!\\s*$)/,\n\
  del: noop,\n\
  text: /^[\\s\\S]+?(?=[\\\\<!\\[_*`]| {2,}\\n\
|$)/\n\
};\n\
\n\
inline._inside = /(?:\\[[^\\]]*\\]|[^\\]]|\\](?=[^\\[]*\\]))*/;\n\
inline._href = /\\s*<?([^\\s]*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*/;\n\
\n\
inline.link = replace(inline.link)\n\
  ('inside', inline._inside)\n\
  ('href', inline._href)\n\
  ();\n\
\n\
inline.reflink = replace(inline.reflink)\n\
  ('inside', inline._inside)\n\
  ();\n\
\n\
/**\n\
 * Normal Inline Grammar\n\
 */\n\
\n\
inline.normal = merge({}, inline);\n\
\n\
/**\n\
 * Pedantic Inline Grammar\n\
 */\n\
\n\
inline.pedantic = merge({}, inline.normal, {\n\
  strong: /^__(?=\\S)([\\s\\S]*?\\S)__(?!_)|^\\*\\*(?=\\S)([\\s\\S]*?\\S)\\*\\*(?!\\*)/,\n\
  em: /^_(?=\\S)([\\s\\S]*?\\S)_(?!_)|^\\*(?=\\S)([\\s\\S]*?\\S)\\*(?!\\*)/\n\
});\n\
\n\
/**\n\
 * GFM Inline Grammar\n\
 */\n\
\n\
inline.gfm = merge({}, inline.normal, {\n\
  escape: replace(inline.escape)('])', '~])')(),\n\
  url: /^(https?:\\/\\/[^\\s]+[^.,:;\"')\\]\\s])/,\n\
  del: /^~{2,}([\\s\\S]+?)~{2,}/,\n\
  text: replace(inline.text)\n\
    (']|', '~]|')\n\
    ('|', '|https?://|')\n\
    ()\n\
});\n\
\n\
/**\n\
 * GFM + Line Breaks Inline Grammar\n\
 */\n\
\n\
inline.breaks = merge({}, inline.gfm, {\n\
  br: replace(inline.br)('{2,}', '*')(),\n\
  text: replace(inline.gfm.text)('{2,}', '*')()\n\
});\n\
\n\
/**\n\
 * Inline Lexer & Compiler\n\
 */\n\
\n\
function InlineLexer(links, options) {\n\
  this.options = options || marked.defaults;\n\
  this.links = links;\n\
  this.rules = inline.normal;\n\
\n\
  if (!this.links) {\n\
    throw new\n\
      Error('Tokens array requires a `links` property.');\n\
  }\n\
\n\
  if (this.options.gfm) {\n\
    if (this.options.breaks) {\n\
      this.rules = inline.breaks;\n\
    } else {\n\
      this.rules = inline.gfm;\n\
    }\n\
  } else if (this.options.pedantic) {\n\
    this.rules = inline.pedantic;\n\
  }\n\
}\n\
\n\
/**\n\
 * Expose Inline Rules\n\
 */\n\
\n\
InlineLexer.rules = inline;\n\
\n\
/**\n\
 * Static Lexing/Compiling Method\n\
 */\n\
\n\
InlineLexer.output = function(src, links, opt) {\n\
  var inline = new InlineLexer(links, opt);\n\
  return inline.output(src);\n\
};\n\
\n\
/**\n\
 * Lexing/Compiling\n\
 */\n\
\n\
InlineLexer.prototype.output = function(src) {\n\
  var out = ''\n\
    , link\n\
    , text\n\
    , href\n\
    , cap;\n\
\n\
  while (src) {\n\
    // escape\n\
    if (cap = this.rules.escape.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += cap[1];\n\
      continue;\n\
    }\n\
\n\
    // autolink\n\
    if (cap = this.rules.autolink.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      if (cap[2] === '@') {\n\
        text = cap[1][6] === ':'\n\
          ? this.mangle(cap[1].substring(7))\n\
          : this.mangle(cap[1]);\n\
        href = this.mangle('mailto:') + text;\n\
      } else {\n\
        text = escape(cap[1]);\n\
        href = text;\n\
      }\n\
      out += '<a href=\"'\n\
        + href\n\
        + '\">'\n\
        + text\n\
        + '</a>';\n\
      continue;\n\
    }\n\
\n\
    // url (gfm)\n\
    if (cap = this.rules.url.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      text = escape(cap[1]);\n\
      href = text;\n\
      out += '<a href=\"'\n\
        + href\n\
        + '\">'\n\
        + text\n\
        + '</a>';\n\
      continue;\n\
    }\n\
\n\
    // tag\n\
    if (cap = this.rules.tag.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += this.options.sanitize\n\
        ? escape(cap[0])\n\
        : cap[0];\n\
      continue;\n\
    }\n\
\n\
    // link\n\
    if (cap = this.rules.link.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += this.outputLink(cap, {\n\
        href: cap[2],\n\
        title: cap[3]\n\
      });\n\
      continue;\n\
    }\n\
\n\
    // reflink, nolink\n\
    if ((cap = this.rules.reflink.exec(src))\n\
        || (cap = this.rules.nolink.exec(src))) {\n\
      src = src.substring(cap[0].length);\n\
      link = (cap[2] || cap[1]).replace(/\\s+/g, ' ');\n\
      link = this.links[link.toLowerCase()];\n\
      if (!link || !link.href) {\n\
        out += cap[0][0];\n\
        src = cap[0].substring(1) + src;\n\
        continue;\n\
      }\n\
      out += this.outputLink(cap, link);\n\
      continue;\n\
    }\n\
\n\
    // strong\n\
    if (cap = this.rules.strong.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += '<strong>'\n\
        + this.output(cap[2] || cap[1])\n\
        + '</strong>';\n\
      continue;\n\
    }\n\
\n\
    // em\n\
    if (cap = this.rules.em.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += '<em>'\n\
        + this.output(cap[2] || cap[1])\n\
        + '</em>';\n\
      continue;\n\
    }\n\
\n\
    // code\n\
    if (cap = this.rules.code.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += '<code>'\n\
        + escape(cap[2], true)\n\
        + '</code>';\n\
      continue;\n\
    }\n\
\n\
    // br\n\
    if (cap = this.rules.br.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += '<br>';\n\
      continue;\n\
    }\n\
\n\
    // del (gfm)\n\
    if (cap = this.rules.del.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += '<del>'\n\
        + this.output(cap[1])\n\
        + '</del>';\n\
      continue;\n\
    }\n\
\n\
    // text\n\
    if (cap = this.rules.text.exec(src)) {\n\
      src = src.substring(cap[0].length);\n\
      out += escape(cap[0]);\n\
      continue;\n\
    }\n\
\n\
    if (src) {\n\
      throw new\n\
        Error('Infinite loop on byte: ' + src.charCodeAt(0));\n\
    }\n\
  }\n\
\n\
  return out;\n\
};\n\
\n\
/**\n\
 * Compile Link\n\
 */\n\
\n\
InlineLexer.prototype.outputLink = function(cap, link) {\n\
  if (cap[0][0] !== '!') {\n\
    return '<a href=\"'\n\
      + escape(link.href)\n\
      + '\"'\n\
      + (link.title\n\
      ? ' title=\"'\n\
      + escape(link.title)\n\
      + '\"'\n\
      : '')\n\
      + '>'\n\
      + this.output(cap[1])\n\
      + '</a>';\n\
  } else {\n\
    return '<img src=\"'\n\
      + escape(link.href)\n\
      + '\" alt=\"'\n\
      + escape(cap[1])\n\
      + '\"'\n\
      + (link.title\n\
      ? ' title=\"'\n\
      + escape(link.title)\n\
      + '\"'\n\
      : '')\n\
      + '>';\n\
  }\n\
};\n\
\n\
/**\n\
 * Mangle Links\n\
 */\n\
\n\
InlineLexer.prototype.mangle = function(text) {\n\
  var out = ''\n\
    , l = text.length\n\
    , i = 0\n\
    , ch;\n\
\n\
  for (; i < l; i++) {\n\
    ch = text.charCodeAt(i);\n\
    if (Math.random() > 0.5) {\n\
      ch = 'x' + ch.toString(16);\n\
    }\n\
    out += '&#' + ch + ';';\n\
  }\n\
\n\
  return out;\n\
};\n\
\n\
/**\n\
 * Parsing & Compiling\n\
 */\n\
\n\
function Parser(options) {\n\
  this.tokens = [];\n\
  this.token = null;\n\
  this.options = options || marked.defaults;\n\
}\n\
\n\
/**\n\
 * Static Parse Method\n\
 */\n\
\n\
Parser.parse = function(src, options) {\n\
  var parser = new Parser(options);\n\
  return parser.parse(src);\n\
};\n\
\n\
/**\n\
 * Parse Loop\n\
 */\n\
\n\
Parser.prototype.parse = function(src) {\n\
  this.inline = new InlineLexer(src.links, this.options);\n\
  this.tokens = src.reverse();\n\
\n\
  var out = '';\n\
  while (this.next()) {\n\
    out += this.tok();\n\
  }\n\
\n\
  return out;\n\
};\n\
\n\
/**\n\
 * Next Token\n\
 */\n\
\n\
Parser.prototype.next = function() {\n\
  return this.token = this.tokens.pop();\n\
};\n\
\n\
/**\n\
 * Preview Next Token\n\
 */\n\
\n\
Parser.prototype.peek = function() {\n\
  return this.tokens[this.tokens.length-1] || 0;\n\
};\n\
\n\
/**\n\
 * Parse Text Tokens\n\
 */\n\
\n\
Parser.prototype.parseText = function() {\n\
  var body = this.token.text;\n\
\n\
  while (this.peek().type === 'text') {\n\
    body += '\\n\
' + this.next().text;\n\
  }\n\
\n\
  return this.inline.output(body);\n\
};\n\
\n\
/**\n\
 * Parse Current Token\n\
 */\n\
\n\
Parser.prototype.tok = function() {\n\
  switch (this.token.type) {\n\
    case 'space': {\n\
      return '';\n\
    }\n\
    case 'hr': {\n\
      return '<hr>\\n\
';\n\
    }\n\
    case 'heading': {\n\
      return '<h'\n\
        + this.token.depth\n\
        + '>'\n\
        + this.inline.output(this.token.text)\n\
        + '</h'\n\
        + this.token.depth\n\
        + '>\\n\
';\n\
    }\n\
    case 'code': {\n\
      if (this.options.highlight) {\n\
        var code = this.options.highlight(this.token.text, this.token.lang);\n\
        if (code != null && code !== this.token.text) {\n\
          this.token.escaped = true;\n\
          this.token.text = code;\n\
        }\n\
      }\n\
\n\
      if (!this.token.escaped) {\n\
        this.token.text = escape(this.token.text, true);\n\
      }\n\
\n\
      return '<pre><code'\n\
        + (this.token.lang\n\
        ? ' class=\"lang-'\n\
        + this.token.lang\n\
        + '\"'\n\
        : '')\n\
        + '>'\n\
        + this.token.text\n\
        + '</code></pre>\\n\
';\n\
    }\n\
    case 'table': {\n\
      var body = ''\n\
        , heading\n\
        , i\n\
        , row\n\
        , cell\n\
        , j;\n\
\n\
      // header\n\
      body += '<thead>\\n\
<tr>\\n\
';\n\
      for (i = 0; i < this.token.header.length; i++) {\n\
        heading = this.inline.output(this.token.header[i]);\n\
        body += this.token.align[i]\n\
          ? '<th align=\"' + this.token.align[i] + '\">' + heading + '</th>\\n\
'\n\
          : '<th>' + heading + '</th>\\n\
';\n\
      }\n\
      body += '</tr>\\n\
</thead>\\n\
';\n\
\n\
      // body\n\
      body += '<tbody>\\n\
'\n\
      for (i = 0; i < this.token.cells.length; i++) {\n\
        row = this.token.cells[i];\n\
        body += '<tr>\\n\
';\n\
        for (j = 0; j < row.length; j++) {\n\
          cell = this.inline.output(row[j]);\n\
          body += this.token.align[j]\n\
            ? '<td align=\"' + this.token.align[j] + '\">' + cell + '</td>\\n\
'\n\
            : '<td>' + cell + '</td>\\n\
';\n\
        }\n\
        body += '</tr>\\n\
';\n\
      }\n\
      body += '</tbody>\\n\
';\n\
\n\
      return '<table>\\n\
'\n\
        + body\n\
        + '</table>\\n\
';\n\
    }\n\
    case 'blockquote_start': {\n\
      var body = '';\n\
\n\
      while (this.next().type !== 'blockquote_end') {\n\
        body += this.tok();\n\
      }\n\
\n\
      return '<blockquote>\\n\
'\n\
        + body\n\
        + '</blockquote>\\n\
';\n\
    }\n\
    case 'list_start': {\n\
      var type = this.token.ordered ? 'ol' : 'ul'\n\
        , body = '';\n\
\n\
      while (this.next().type !== 'list_end') {\n\
        body += this.tok();\n\
      }\n\
\n\
      return '<'\n\
        + type\n\
        + '>\\n\
'\n\
        + body\n\
        + '</'\n\
        + type\n\
        + '>\\n\
';\n\
    }\n\
    case 'list_item_start': {\n\
      var body = '';\n\
\n\
      while (this.next().type !== 'list_item_end') {\n\
        body += this.token.type === 'text'\n\
          ? this.parseText()\n\
          : this.tok();\n\
      }\n\
\n\
      return '<li>'\n\
        + body\n\
        + '</li>\\n\
';\n\
    }\n\
    case 'loose_item_start': {\n\
      var body = '';\n\
\n\
      while (this.next().type !== 'list_item_end') {\n\
        body += this.tok();\n\
      }\n\
\n\
      return '<li>'\n\
        + body\n\
        + '</li>\\n\
';\n\
    }\n\
    case 'html': {\n\
      return !this.token.pre && !this.options.pedantic\n\
        ? this.inline.output(this.token.text)\n\
        : this.token.text;\n\
    }\n\
    case 'paragraph': {\n\
      return '<p>'\n\
        + this.inline.output(this.token.text)\n\
        + '</p>\\n\
';\n\
    }\n\
    case 'text': {\n\
      return '<p>'\n\
        + this.parseText()\n\
        + '</p>\\n\
';\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Helpers\n\
 */\n\
\n\
function escape(html, encode) {\n\
  return html\n\
    .replace(!encode ? /&(?!#?\\w+;)/g : /&/g, '&amp;')\n\
    .replace(/</g, '&lt;')\n\
    .replace(/>/g, '&gt;')\n\
    .replace(/\"/g, '&quot;')\n\
    .replace(/'/g, '&#39;');\n\
}\n\
\n\
function replace(regex, opt) {\n\
  regex = regex.source;\n\
  opt = opt || '';\n\
  return function self(name, val) {\n\
    if (!name) return new RegExp(regex, opt);\n\
    val = val.source || val;\n\
    val = val.replace(/(^|[^\\[])\\^/g, '$1');\n\
    regex = regex.replace(name, val);\n\
    return self;\n\
  };\n\
}\n\
\n\
function noop() {}\n\
noop.exec = noop;\n\
\n\
function merge(obj) {\n\
  var i = 1\n\
    , target\n\
    , key;\n\
\n\
  for (; i < arguments.length; i++) {\n\
    target = arguments[i];\n\
    for (key in target) {\n\
      if (Object.prototype.hasOwnProperty.call(target, key)) {\n\
        obj[key] = target[key];\n\
      }\n\
    }\n\
  }\n\
\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Marked\n\
 */\n\
\n\
function marked(src, opt) {\n\
  try {\n\
    return Parser.parse(Lexer.lex(src, opt), opt);\n\
  } catch (e) {\n\
    e.message += '\\n\
Please report this to https://github.com/chjj/marked.';\n\
    if ((opt || marked.defaults).silent) {\n\
      return 'An error occured:\\n\
' + e.message;\n\
    }\n\
    throw e;\n\
  }\n\
}\n\
\n\
/**\n\
 * Options\n\
 */\n\
\n\
marked.options =\n\
marked.setOptions = function(opt) {\n\
  marked.defaults = opt;\n\
  return marked;\n\
};\n\
\n\
marked.defaults = {\n\
  gfm: true,\n\
  tables: true,\n\
  breaks: false,\n\
  pedantic: false,\n\
  sanitize: false,\n\
  silent: false,\n\
  highlight: null\n\
};\n\
\n\
/**\n\
 * Expose\n\
 */\n\
\n\
marked.Parser = Parser;\n\
marked.parser = Parser.parse;\n\
\n\
marked.Lexer = Lexer;\n\
marked.lexer = Lexer.lex;\n\
\n\
marked.InlineLexer = InlineLexer;\n\
marked.inlineLexer = InlineLexer.output;\n\
\n\
marked.parse = marked;\n\
\n\
if (typeof module !== 'undefined') {\n\
  module.exports = marked;\n\
} else if (typeof define === 'function' && define.amd) {\n\
  define(function() { return marked; });\n\
} else {\n\
  this.marked = marked;\n\
}\n\
\n\
}).call(function() {\n\
  return this || (typeof window !== 'undefined' ? window : global);\n\
}());\n\
//@ sourceURL=component-marked/lib/marked.js"
));
require.register("enome-components-webfont/index.js", Function("exports, require, module",
"/*\n\
 * Copyright 2013 Small Batch, Inc.\n\
 *\n\
 * Licensed under the Apache License, Version 2.0 (the \"License\"); you may not\n\
 * use this file except in compliance with the License. You may obtain a copy of\n\
 * the License at\n\
 *\n\
 * http://www.apache.org/licenses/LICENSE-2.0\n\
 *\n\
 * Unless required by applicable law or agreed to in writing, software\n\
 * distributed under the License is distributed on an \"AS IS\" BASIS, WITHOUT\n\
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the\n\
 * License for the specific language governing permissions and limitations under\n\
 * the License.\n\
 */\n\
;(function(window,document,undefined){\n\
var j=void 0,k=!0,l=null,p=!1;function q(a){return function(){return this[a]}}var aa=this;function ba(a,b){var c=a.split(\".\"),d=aa;!(c[0]in d)&&d.execScript&&d.execScript(\"var \"+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&b!==j?d[e]=b:d=d[e]?d[e]:d[e]={}}aa.Ba=k;function ca(a,b,c){return a.call.apply(a.bind,arguments)}\n\
function da(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function s(a,b,c){s=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf(\"native code\")?ca:da;return s.apply(l,arguments)}var ea=Date.now||function(){return+new Date};function fa(a,b){this.G=a;this.u=b||a;this.z=this.u.document;this.R=j}fa.prototype.createElement=function(a,b,c){a=this.z.createElement(a);if(b)for(var d in b)if(b.hasOwnProperty(d))if(\"style\"==d){var e=a,f=b[d];ga(this)?e.setAttribute(\"style\",f):e.style.cssText=f}else a.setAttribute(d,b[d]);c&&a.appendChild(this.z.createTextNode(c));return a};function t(a,b,c){a=a.z.getElementsByTagName(b)[0];a||(a=document.documentElement);a&&a.lastChild&&a.insertBefore(c,a.lastChild)}\n\
function u(a,b){return a.createElement(\"link\",{rel:\"stylesheet\",href:b})}function ha(a,b){return a.createElement(\"script\",{src:b})}function v(a,b){for(var c=a.className.split(/\\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return;c.push(b);a.className=c.join(\" \").replace(/\\s+/g,\" \").replace(/^\\s+|\\s+$/,\"\")}function w(a,b){for(var c=a.className.split(/\\s+/),d=[],e=0,f=c.length;e<f;e++)c[e]!=b&&d.push(c[e]);a.className=d.join(\" \").replace(/\\s+/g,\" \").replace(/^\\s+|\\s+$/,\"\")}\n\
function ia(a,b){for(var c=a.className.split(/\\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return k;return p}function ga(a){if(a.R===j){var b=a.z.createElement(\"p\");b.innerHTML='<a style=\"top:1px;\">w</a>';a.R=/top/.test(b.getElementsByTagName(\"a\")[0].getAttribute(\"style\"))}return a.R}function x(a){var b=a.u.location.protocol;\"about:\"==b&&(b=a.G.location.protocol);return\"https:\"==b?\"https:\":\"http:\"};function y(a,b,c){this.w=a;this.T=b;this.Aa=c}ba(\"webfont.BrowserInfo\",y);y.prototype.qa=q(\"w\");y.prototype.hasWebFontSupport=y.prototype.qa;y.prototype.ra=q(\"T\");y.prototype.hasWebKitFallbackBug=y.prototype.ra;y.prototype.sa=q(\"Aa\");y.prototype.hasWebKitMetricsBug=y.prototype.sa;function z(a,b,c,d){this.e=a!=l?a:l;this.o=b!=l?b:l;this.ba=c!=l?c:l;this.f=d!=l?d:l}var ja=/^([0-9]+)(?:[\\._-]([0-9]+))?(?:[\\._-]([0-9]+))?(?:[\\._+-]?(.*))?$/;z.prototype.toString=function(){return[this.e,this.o||\"\",this.ba||\"\",this.f||\"\"].join(\"\")};\n\
function A(a){a=ja.exec(a);var b=l,c=l,d=l,e=l;a&&(a[1]!==l&&a[1]&&(b=parseInt(a[1],10)),a[2]!==l&&a[2]&&(c=parseInt(a[2],10)),a[3]!==l&&a[3]&&(d=parseInt(a[3],10)),a[4]!==l&&a[4]&&(e=/^[0-9]+$/.test(a[4])?parseInt(a[4],10):a[4]));return new z(b,c,d,e)};function B(a,b,c,d,e,f,g,h,n,m,r){this.J=a;this.Ha=b;this.za=c;this.ga=d;this.Fa=e;this.fa=f;this.xa=g;this.Ga=h;this.wa=n;this.ea=m;this.k=r}ba(\"webfont.UserAgent\",B);B.prototype.getName=q(\"J\");B.prototype.getName=B.prototype.getName;B.prototype.pa=q(\"za\");B.prototype.getVersion=B.prototype.pa;B.prototype.la=q(\"ga\");B.prototype.getEngine=B.prototype.la;B.prototype.ma=q(\"fa\");B.prototype.getEngineVersion=B.prototype.ma;B.prototype.na=q(\"xa\");B.prototype.getPlatform=B.prototype.na;B.prototype.oa=q(\"wa\");\n\
B.prototype.getPlatformVersion=B.prototype.oa;B.prototype.ka=q(\"ea\");B.prototype.getDocumentMode=B.prototype.ka;B.prototype.ja=q(\"k\");B.prototype.getBrowserInfo=B.prototype.ja;function C(a,b){this.a=a;this.H=b}var ka=new B(\"Unknown\",new z,\"Unknown\",\"Unknown\",new z,\"Unknown\",\"Unknown\",new z,\"Unknown\",j,new y(p,p,p));\n\
C.prototype.parse=function(){var a;if(-1!=this.a.indexOf(\"MSIE\")){a=D(this);var b=E(this),c=A(b),d=F(this.a,/MSIE ([\\d\\w\\.]+)/,1),e=A(d);a=new B(\"MSIE\",e,d,\"MSIE\",e,d,a,c,b,G(this.H),new y(\"Windows\"==a&&6<=e.e||\"Windows Phone\"==a&&8<=c.e,p,p))}else if(-1!=this.a.indexOf(\"Opera\"))a:{a=\"Unknown\";var b=F(this.a,/Presto\\/([\\d\\w\\.]+)/,1),c=A(b),d=E(this),e=A(d),f=G(this.H);c.e!==l?a=\"Presto\":(-1!=this.a.indexOf(\"Gecko\")&&(a=\"Gecko\"),b=F(this.a,/rv:([^\\)]+)/,1),c=A(b));if(-1!=this.a.indexOf(\"Opera Mini/\")){var g=\n\
F(this.a,/Opera Mini\\/([\\d\\.]+)/,1),h=A(g);a=new B(\"OperaMini\",h,g,a,c,b,D(this),e,d,f,new y(p,p,p))}else{if(-1!=this.a.indexOf(\"Version/\")&&(g=F(this.a,/Version\\/([\\d\\.]+)/,1),h=A(g),h.e!==l)){a=new B(\"Opera\",h,g,a,c,b,D(this),e,d,f,new y(10<=h.e,p,p));break a}g=F(this.a,/Opera[\\/ ]([\\d\\.]+)/,1);h=A(g);a=h.e!==l?new B(\"Opera\",h,g,a,c,b,D(this),e,d,f,new y(10<=h.e,p,p)):new B(\"Opera\",new z,\"Unknown\",a,c,b,D(this),e,d,f,new y(p,p,p))}}else if(/AppleWeb(K|k)it/.test(this.a)){a=D(this);var b=E(this),\n\
c=A(b),d=F(this.a,/AppleWeb(?:K|k)it\\/([\\d\\.\\+]+)/,1),e=A(d),f=\"Unknown\",g=new z,h=\"Unknown\",n=p;-1!=this.a.indexOf(\"Chrome\")||-1!=this.a.indexOf(\"CrMo\")||-1!=this.a.indexOf(\"CriOS\")?f=\"Chrome\":/Silk\\/\\d/.test(this.a)?f=\"Silk\":\"BlackBerry\"==a||\"Android\"==a?f=\"BuiltinBrowser\":-1!=this.a.indexOf(\"Safari\")?f=\"Safari\":-1!=this.a.indexOf(\"AdobeAIR\")&&(f=\"AdobeAIR\");\"BuiltinBrowser\"==f?h=\"Unknown\":\"Silk\"==f?h=F(this.a,/Silk\\/([\\d\\._]+)/,1):\"Chrome\"==f?h=F(this.a,/(Chrome|CrMo|CriOS)\\/([\\d\\.]+)/,2):-1!=\n\
this.a.indexOf(\"Version/\")?h=F(this.a,/Version\\/([\\d\\.\\w]+)/,1):\"AdobeAIR\"==f&&(h=F(this.a,/AdobeAIR\\/([\\d\\.]+)/,1));g=A(h);n=\"AdobeAIR\"==f?2<g.e||2==g.e&&5<=g.o:\"BlackBerry\"==a?10<=c.e:\"Android\"==a?2<c.e||2==c.e&&1<c.o:526<=e.e||525<=e.e&&13<=e.o;a=new B(f,g,h,\"AppleWebKit\",e,d,a,c,b,G(this.H),new y(n,536>e.e||536==e.e&&11>e.o,\"iPhone\"==a||\"iPad\"==a||\"iPod\"==a||\"Macintosh\"==a))}else-1!=this.a.indexOf(\"Gecko\")?(a=\"Unknown\",b=new z,c=\"Unknown\",d=E(this),e=A(d),f=p,-1!=this.a.indexOf(\"Firefox\")?(a=\n\
\"Firefox\",c=F(this.a,/Firefox\\/([\\d\\w\\.]+)/,1),b=A(c),f=3<=b.e&&5<=b.o):-1!=this.a.indexOf(\"Mozilla\")&&(a=\"Mozilla\"),g=F(this.a,/rv:([^\\)]+)/,1),h=A(g),f||(f=1<h.e||1==h.e&&9<h.o||1==h.e&&9==h.o&&2<=h.ba||g.match(/1\\.9\\.1b[123]/)!=l||g.match(/1\\.9\\.1\\.[\\d\\.]+/)!=l),a=new B(a,b,c,\"Gecko\",h,g,D(this),e,d,G(this.H),new y(f,p,p))):a=ka;return a};\n\
function D(a){var b=F(a.a,/(iPod|iPad|iPhone|Android|Windows Phone|BB\\d{2}|BlackBerry)/,1);if(\"\"!=b)return/BB\\d{2}/.test(b)&&(b=\"BlackBerry\"),b;a=F(a.a,/(Linux|Mac_PowerPC|Macintosh|Windows|CrOS)/,1);return\"\"!=a?(\"Mac_PowerPC\"==a&&(a=\"Macintosh\"),a):\"Unknown\"}\n\
function E(a){var b=F(a.a,/(OS X|Windows NT|Android) ([^;)]+)/,2);if(b||(b=F(a.a,/Windows Phone( OS)? ([^;)]+)/,2))||(b=F(a.a,/(iPhone )?OS ([\\d_]+)/,2)))return b;if(b=F(a.a,/(?:Linux|CrOS) ([^;)]+)/,1))for(var b=b.split(/\\s/),c=0;c<b.length;c+=1)if(/^[\\d\\._]+$/.test(b[c]))return b[c];return(a=F(a.a,/(BB\\d{2}|BlackBerry).*?Version\\/([^\\s]*)/,2))?a:\"Unknown\"}function F(a,b,c){return(a=a.match(b))&&a[c]?a[c]:\"\"}function G(a){if(a.documentMode)return a.documentMode};function la(a){this.va=a||\"-\"}la.prototype.f=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\\W_]+/g,\"\").toLowerCase());return b.join(this.va)};function H(a,b){this.J=a;this.U=4;this.K=\"n\";var c=(b||\"n4\").match(/^([nio])([1-9])$/i);c&&(this.K=c[1],this.U=parseInt(c[2],10))}H.prototype.getName=q(\"J\");function I(a){return a.K+a.U}function ma(a){var b=4,c=\"n\",d=l;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function na(a,b,c){this.c=a;this.h=b;this.M=c;this.j=\"wf\";this.g=new la(\"-\")}function pa(a){v(a.h,a.g.f(a.j,\"loading\"));J(a,\"loading\")}function K(a){w(a.h,a.g.f(a.j,\"loading\"));ia(a.h,a.g.f(a.j,\"active\"))||v(a.h,a.g.f(a.j,\"inactive\"));J(a,\"inactive\")}function J(a,b,c){if(a.M[b])if(c)a.M[b](c.getName(),I(c));else a.M[b]()};function L(a,b){this.c=a;this.C=b;this.s=this.c.createElement(\"span\",{\"aria-hidden\":\"true\"},this.C)}\n\
function M(a,b){var c=a.s,d;d=[];for(var e=b.J.split(/,\\s*/),f=0;f<e.length;f++){var g=e[f].replace(/['\"]/g,\"\");-1==g.indexOf(\" \")?d.push(g):d.push(\"'\"+g+\"'\")}d=d.join(\",\");e=\"normal\";f=b.U+\"00\";\"o\"===b.K?e=\"oblique\":\"i\"===b.K&&(e=\"italic\");d=\"position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:\"+d+\";\"+(\"font-style:\"+e+\";font-weight:\"+f+\";\");ga(a.c)?c.setAttribute(\"style\",d):c.style.cssText=\n\
d}function N(a){t(a.c,\"body\",a.s)}L.prototype.remove=function(){var a=this.s;a.parentNode&&a.parentNode.removeChild(a)};function qa(a,b,c,d,e,f,g,h){this.V=a;this.ta=b;this.c=c;this.q=d;this.C=h||\"BESbswy\";this.k=e;this.F={};this.S=f||5E3;this.Z=g||l;this.B=this.A=l;a=new L(this.c,this.C);N(a);for(var n in O)O.hasOwnProperty(n)&&(M(a,new H(O[n],I(this.q))),this.F[O[n]]=a.s.offsetWidth);a.remove()}var O={Ea:\"serif\",Da:\"sans-serif\",Ca:\"monospace\"};\n\
qa.prototype.start=function(){this.A=new L(this.c,this.C);N(this.A);this.B=new L(this.c,this.C);N(this.B);this.ya=ea();M(this.A,new H(this.q.getName()+\",serif\",I(this.q)));M(this.B,new H(this.q.getName()+\",sans-serif\",I(this.q)));ra(this)};function sa(a,b,c){for(var d in O)if(O.hasOwnProperty(d)&&b===a.F[O[d]]&&c===a.F[O[d]])return k;return p}\n\
function ra(a){var b=a.A.s.offsetWidth,c=a.B.s.offsetWidth;b===a.F.serif&&c===a.F[\"sans-serif\"]||a.k.T&&sa(a,b,c)?ea()-a.ya>=a.S?a.k.T&&sa(a,b,c)&&(a.Z===l||a.Z.hasOwnProperty(a.q.getName()))?P(a,a.V):P(a,a.ta):setTimeout(s(function(){ra(this)},a),25):P(a,a.V)}function P(a,b){a.A.remove();a.B.remove();b(a.q)};function R(a,b,c,d){this.c=b;this.t=c;this.N=0;this.ca=this.Y=p;this.S=d;this.k=a.k}function ta(a,b,c,d,e){if(0===b.length&&e)K(a.t);else{a.N+=b.length;e&&(a.Y=e);for(e=0;e<b.length;e++){var f=b[e],g=c[f.getName()],h=a.t,n=f;v(h.h,h.g.f(h.j,n.getName(),I(n).toString(),\"loading\"));J(h,\"fontloading\",n);(new qa(s(a.ha,a),s(a.ia,a),a.c,f,a.k,a.S,d,g)).start()}}}\n\
R.prototype.ha=function(a){var b=this.t;w(b.h,b.g.f(b.j,a.getName(),I(a).toString(),\"loading\"));w(b.h,b.g.f(b.j,a.getName(),I(a).toString(),\"inactive\"));v(b.h,b.g.f(b.j,a.getName(),I(a).toString(),\"active\"));J(b,\"fontactive\",a);this.ca=k;ua(this)};R.prototype.ia=function(a){var b=this.t;w(b.h,b.g.f(b.j,a.getName(),I(a).toString(),\"loading\"));ia(b.h,b.g.f(b.j,a.getName(),I(a).toString(),\"active\"))||v(b.h,b.g.f(b.j,a.getName(),I(a).toString(),\"inactive\"));J(b,\"fontinactive\",a);ua(this)};\n\
function ua(a){0==--a.N&&a.Y&&(a.ca?(a=a.t,w(a.h,a.g.f(a.j,\"loading\")),w(a.h,a.g.f(a.j,\"inactive\")),v(a.h,a.g.f(a.j,\"active\")),J(a,\"active\")):K(a.t))};function S(a,b,c){this.G=a;this.W=b;this.a=c;this.O=this.P=0}function T(a,b){U.W.$[a]=b}S.prototype.load=function(a){var b=a.context||this.G;this.c=new fa(this.G,b);b=new na(this.c,b.document.documentElement,a);if(this.a.k.w){var c=this.W,d=this.c,e=[],f;for(f in a)if(a.hasOwnProperty(f)){var g=c.$[f];g&&e.push(g(a[f],d))}a=a.timeout;this.O=this.P=e.length;a=new R(this.a,this.c,b,a);f=0;for(c=e.length;f<c;f++)d=e[f],d.v(this.a,s(this.ua,this,d,b,a))}else K(b)};\n\
S.prototype.ua=function(a,b,c,d){var e=this;d?a.load(function(a,d,h){var n=0==--e.P;n&&pa(b);setTimeout(function(){ta(c,a,d||{},h||l,n)},0)}):(a=0==--this.P,this.O--,a&&(0==this.O?K(b):pa(b)),ta(c,[],{},l,a))};var va=window,wa=(new C(navigator.userAgent,document)).parse(),U=va.WebFont=new S(window,new function(){this.$={}},wa);U.load=U.load;function V(a,b){this.c=a;this.d=b}V.prototype.load=function(a){var b,c,d=this.d.urls||[],e=this.d.families||[];b=0;for(c=d.length;b<c;b++)t(this.c,\"head\",u(this.c,d[b]));d=[];b=0;for(c=e.length;b<c;b++){var f=e[b].split(\":\");if(f[1])for(var g=f[1].split(\",\"),h=0;h<g.length;h+=1)d.push(new H(f[0],g[h]));else d.push(new H(f[0]))}a(d)};V.prototype.v=function(a,b){return b(a.k.w)};T(\"custom\",function(a,b){return new V(b,a)});function W(a,b){this.c=a;this.d=b}var xa={regular:\"n4\",bold:\"n7\",italic:\"i4\",bolditalic:\"i7\",r:\"n4\",b:\"n7\",i:\"i4\",bi:\"i7\"};W.prototype.v=function(a,b){return b(a.k.w)};W.prototype.load=function(a){t(this.c,\"head\",u(this.c,x(this.c)+\"//webfonts.fontslive.com/css/\"+this.d.key+\".css\"));for(var b=this.d.families,c=[],d=0,e=b.length;d<e;d++)c.push.apply(c,ya(b[d]));a(c)};\n\
function ya(a){var b=a.split(\":\");a=b[0];if(b[1]){for(var c=b[1].split(\",\"),b=[],d=0,e=c.length;d<e;d++){var f=c[d];if(f){var g=xa[f];b.push(g?g:f)}}c=[];for(d=0;d<b.length;d+=1)c.push(new H(a,b[d]));return c}return[new H(a)]}T(\"ascender\",function(a,b){return new W(b,a)});function X(a,b,c){this.a=a;this.c=b;this.d=c;this.m=[]}\n\
X.prototype.v=function(a,b){var c=this,d=c.d.projectId,e=c.d.version;if(d){var f=c.c.u,g=c.c.createElement(\"script\");g.id=\"__MonotypeAPIScript__\"+d;var h=p;g.onload=g.onreadystatechange=function(){if(!h&&(!this.readyState||\"loaded\"===this.readyState||\"complete\"===this.readyState)){h=k;if(f[\"__mti_fntLst\"+d]){var e=f[\"__mti_fntLst\"+d]();if(e)for(var m=0;m<e.length;m++)c.m.push(new H(e[m].fontfamily))}b(a.k.w);g.onload=g.onreadystatechange=l}};g.src=c.D(d,e);t(this.c,\"head\",g)}else b(k)};\n\
X.prototype.D=function(a,b){var c=x(this.c),d=(this.d.api||\"fast.fonts.com/jsapi\").replace(/^.*http(s?):(\\/\\/)?/,\"\");return c+\"//\"+d+\"/\"+a+\".js\"+(b?\"?v=\"+b:\"\")};X.prototype.load=function(a){a(this.m)};T(\"monotype\",function(a,b){var c=(new C(navigator.userAgent,document)).parse();return new X(c,b,a)});function Y(a,b){this.c=a;this.d=b;this.m=[]}Y.prototype.D=function(a){var b=x(this.c);return(this.d.api||b+\"//use.typekit.net\")+\"/\"+a+\".js\"};\n\
Y.prototype.v=function(a,b){var c=this.d.id,d=this.d,e=this.c.u,f=this;c?(e.__webfonttypekitmodule__||(e.__webfonttypekitmodule__={}),e.__webfonttypekitmodule__[c]=function(c){c(a,d,function(a,c,d){for(var e=0;e<c.length;e+=1){var g=d[c[e]];if(g)for(var Q=0;Q<g.length;Q+=1)f.m.push(new H(c[e],g[Q]));else f.m.push(new H(c[e]))}b(a)})},c=ha(this.c,this.D(c)),t(this.c,\"head\",c)):b(k)};Y.prototype.load=function(a){a(this.m)};T(\"typekit\",function(a,b){return new Y(b,a)});function za(a,b,c){this.L=a?a:b+Aa;this.p=[];this.Q=[];this.da=c||\"\"}var Aa=\"//fonts.googleapis.com/css\";za.prototype.f=function(){if(0==this.p.length)throw Error(\"No fonts to load !\");if(-1!=this.L.indexOf(\"kit=\"))return this.L;for(var a=this.p.length,b=[],c=0;c<a;c++)b.push(this.p[c].replace(/ /g,\"+\"));a=this.L+\"?family=\"+b.join(\"%7C\");0<this.Q.length&&(a+=\"&subset=\"+this.Q.join(\",\"));0<this.da.length&&(a+=\"&text=\"+encodeURIComponent(this.da));return a};function Ba(a){this.p=a;this.aa=[];this.I={}}\n\
var Ca={latin:\"BESbswy\",cyrillic:\"&#1081;&#1103;&#1046;\",greek:\"&#945;&#946;&#931;\",khmer:\"&#x1780;&#x1781;&#x1782;\",Hanuman:\"&#x1780;&#x1781;&#x1782;\"},Da={thin:\"1\",extralight:\"2\",\"extra-light\":\"2\",ultralight:\"2\",\"ultra-light\":\"2\",light:\"3\",regular:\"4\",book:\"4\",medium:\"5\",\"semi-bold\":\"6\",semibold:\"6\",\"demi-bold\":\"6\",demibold:\"6\",bold:\"7\",\"extra-bold\":\"8\",extrabold:\"8\",\"ultra-bold\":\"8\",ultrabold:\"8\",black:\"9\",heavy:\"9\",l:\"3\",r:\"4\",b:\"7\"},Ea={i:\"i\",italic:\"i\",n:\"n\",normal:\"n\"},Fa=RegExp(\"^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$\");\n\
Ba.prototype.parse=function(){for(var a=this.p.length,b=0;b<a;b++){var c=this.p[b].split(\":\"),d=c[0].replace(/\\+/g,\" \"),e=[\"n4\"];if(2<=c.length){var f;var g=c[1];f=[];if(g)for(var g=g.split(\",\"),h=g.length,n=0;n<h;n++){var m;m=g[n];if(m.match(/^[\\w]+$/)){m=Fa.exec(m.toLowerCase());var r=j;if(m==l)r=\"\";else{r=j;r=m[1];if(r==l||\"\"==r)r=\"4\";else var oa=Da[r],r=oa?oa:isNaN(r)?\"4\":r.substr(0,1);r=[m[2]==l||\"\"==m[2]?\"n\":Ea[m[2]],r].join(\"\")}m=r}else m=\"\";m&&f.push(m)}0<f.length&&(e=f);3==c.length&&(c=c[2],\n\
f=[],c=!c?f:c.split(\",\"),0<c.length&&(c=Ca[c[0]])&&(this.I[d]=c))}this.I[d]||(c=Ca[d])&&(this.I[d]=c);for(c=0;c<e.length;c+=1)this.aa.push(new H(d,e[c]))}};function Z(a,b,c){this.a=a;this.c=b;this.d=c}var Ga={Arimo:k,Cousine:k,Tinos:k};Z.prototype.v=function(a,b){b(a.k.w)};Z.prototype.load=function(a){var b=this.c;if(\"MSIE\"==this.a.getName()&&this.d.blocking!=k){var c=s(this.X,this,a),d=function(){b.z.body?c():setTimeout(d,0)};d()}else this.X(a)};\n\
Z.prototype.X=function(a){for(var b=this.c,c=new za(this.d.api,x(b),this.d.text),d=this.d.families,e=d.length,f=0;f<e;f++){var g=d[f].split(\":\");3==g.length&&c.Q.push(g.pop());var h=\"\";2==g.length&&\"\"!=g[1]&&(h=\":\");c.p.push(g.join(h))}d=new Ba(d);d.parse();t(b,\"head\",u(b,c.f()));a(d.aa,d.I,Ga)};T(\"google\",function(a,b){var c=(new C(navigator.userAgent,document)).parse();return new Z(c,b,a)});function $(a,b){this.c=a;this.d=b;this.m=[]}$.prototype.D=function(a){return x(this.c)+(this.d.api||\"//f.fontdeck.com/s/css/js/\")+(this.c.u.location.hostname||this.c.G.location.hostname)+\"/\"+a+\".js\"};\n\
$.prototype.v=function(a,b){var c=this.d.id,d=this.c.u,e=this;c?(d.__webfontfontdeckmodule__||(d.__webfontfontdeckmodule__={}),d.__webfontfontdeckmodule__[c]=function(a,c){for(var d=0,n=c.fonts.length;d<n;++d){var m=c.fonts[d];e.m.push(new H(m.name,ma(\"font-weight:\"+m.weight+\";font-style:\"+m.style)))}b(a)},c=ha(this.c,this.D(c)),t(this.c,\"head\",c)):b(k)};$.prototype.load=function(a){a(this.m)};T(\"fontdeck\",function(a,b){return new $(b,a)});window.WebFontConfig&&U.load(window.WebFontConfig);\n\
})(this,document);\n\
//@ sourceURL=enome-components-webfont/index.js"
));
require.register("component-indexof/index.js", Function("exports, require, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};//@ sourceURL=component-indexof/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require('indexof');\n\
\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  fn._off = on;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var i = index(callbacks, fn._off || fn);\n\
  if (~i) callbacks.splice(i, 1);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
//@ sourceURL=component-emitter/index.js"
));
require.register("component-upload/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require('emitter');\n\
\n\
/**\n\
 * Expose `Upload`.\n\
 */\n\
\n\
module.exports = Upload;\n\
\n\
/**\n\
 * Initialize a new `Upload` file`.\n\
 * This represents a single file upload.\n\
 *\n\
 * Events:\n\
 *\n\
 *   - `error` an error occurred\n\
 *   - `abort` upload was aborted\n\
 *   - `progress` upload in progress (`e.percent` etc)\n\
 *   - `end` upload is complete\n\
 *\n\
 * @param {File} file\n\
 * @api private\n\
 */\n\
\n\
function Upload(file) {\n\
  if (!(this instanceof Upload)) return new Upload(file);\n\
  Emitter.call(this);\n\
  this.file = file;\n\
  file.slice = file.slice || file.webkitSlice;\n\
}\n\
\n\
/**\n\
 * Mixin emitter.\n\
 */\n\
\n\
Emitter(Upload.prototype);\n\
\n\
/**\n\
 * Upload to the given `path`.\n\
 *\n\
 * @param {String} path\n\
 * @param {Function} [fn]\n\
 * @api public\n\
 */\n\
\n\
Upload.prototype.to = function(path, fn){\n\
  // TODO: x-browser\n\
  var self = this;\n\
  fn = fn || function(){};\n\
  var req = this.req = new XMLHttpRequest;\n\
  req.open('POST', path);\n\
  req.onload = this.onload.bind(this);\n\
  req.onerror = this.onerror.bind(this);\n\
  req.upload.onprogress = this.onprogress.bind(this);\n\
  req.onreadystatechange = function(){\n\
    if (4 == req.readyState) {\n\
      var type = req.status / 100 | 0;\n\
      if (2 == type) return fn(null, req);\n\
      var err = new Error(req.statusText + ': ' + req.response);\n\
      err.status = req.status;\n\
      fn(err);\n\
    }\n\
  };\n\
  var body = new FormData;\n\
  body.append('file', this.file);\n\
  req.send(body);\n\
};\n\
\n\
/**\n\
 * Abort the XHR.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
Upload.prototype.abort = function(){\n\
  this.emit('abort');\n\
  this.req.abort();\n\
};\n\
\n\
/**\n\
 * Error handler.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Upload.prototype.onerror = function(e){\n\
  this.emit('error', e);\n\
};\n\
\n\
/**\n\
 * Onload handler.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Upload.prototype.onload = function(e){\n\
  this.emit('end', this.req);\n\
};\n\
\n\
/**\n\
 * Progress handler.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Upload.prototype.onprogress = function(e){\n\
  e.percent = e.loaded / e.total * 100;\n\
  this.emit('progress', e);\n\
};\n\
//@ sourceURL=component-upload/index.js"
));
require.register("component-normalized-upload/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `normalize()`.\n\
 */\n\
\n\
module.exports = normalize;\n\
\n\
/**\n\
 * Get `type` from `e` on .clipboardData or .dataTransfer.\n\
 *\n\
 * @param {Event} e\n\
 * @param {String} type\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function get(e, type) {\n\
  if (e.clipboardData) return e.clipboardData[type] || [];\n\
  if (e.dataTransfer) return e.dataTransfer[type] || [];\n\
  return [];\n\
}\n\
\n\
/**\n\
 * Normalize `e` adding the `e.items` array and invoke `fn()`.\n\
 *\n\
 * @param {Event} e\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
function normalize(e, fn) {\n\
  e.items = [];\n\
\n\
  var ignore = [];\n\
  var files = get(e, 'files');\n\
  var items = get(e, 'items');\n\
\n\
  normalizeItems(e, items, ignore, function(){\n\
    normalizeFiles(e, files, ignore, function(){\n\
      fn(e)\n\
    });\n\
  });\n\
}\n\
\n\
/**\n\
 * Process `files`.\n\
 *\n\
 * Some browsers (chrome) populate both .items and .files\n\
 * with the same things, so we need to check that the `File`\n\
 * is not already present.\n\
 *\n\
 * @param {Event} e\n\
 * @param {FileList} files\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function normalizeFiles(e, files, ignore, fn) {\n\
  var pending = files.length;\n\
\n\
  if (!pending) return fn();\n\
\n\
  for (var i = 0; i < files.length; i++) {\n\
    var file = files[i];\n\
    if (~ignore.indexOf(file)) continue;\n\
    if (~e.items.indexOf(file)) continue;\n\
    file.kind = 'file';\n\
    e.items.push(file);\n\
  }\n\
\n\
  fn();\n\
}\n\
\n\
/**\n\
 * Process `items`.\n\
 *\n\
 * @param {Event} e\n\
 * @param {ItemList} items\n\
 * @param {Function} fn\n\
 * @return {Type}\n\
 * @api private\n\
 */\n\
\n\
function normalizeItems(e, items, ignore, fn){\n\
  var pending = items.length;\n\
\n\
  if (!pending) return fn();\n\
\n\
  for (var i = 0; i < items.length; i++) {\n\
    var item = items[i];\n\
\n\
    // directories\n\
    if ('file' == item.kind && item.webkitGetAsEntry) {\n\
      var entry = item.webkitGetAsEntry();\n\
      if (entry && entry.isDirectory) {\n\
        ignore.push(item.getAsFile());\n\
        walk(e, entry, function(){\n\
          --pending || fn(e);\n\
        });\n\
        continue;\n\
      }\n\
    }\n\
\n\
    // files\n\
    if ('file' == item.kind) {\n\
      var file = item.getAsFile();\n\
      file.kind = 'file';\n\
      e.items.push(file);\n\
      --pending || fn(e);\n\
      continue;\n\
    }\n\
\n\
    // others\n\
    (function(){\n\
      var type = item.type;\n\
      var kind = item.kind;\n\
      item.getAsString(function(str){\n\
        e.items.push({\n\
          kind: kind,\n\
          type: type,\n\
          string: str\n\
        });\n\
\n\
        --pending || fn(e);\n\
      })\n\
    })()\n\
  }\n\
};\n\
\n\
/**\n\
 * Walk `entry`.\n\
 *\n\
 * @param {Event} e\n\
 * @param {FileEntry} entry\n\
 * @param {Function} fn\n\
 * @api private\n\
 */\n\
\n\
function walk(e, entry, fn){\n\
  if (entry.isFile) {\n\
    return entry.file(function(file){\n\
      file.entry = entry;\n\
      file.kind = 'file';\n\
      e.items.push(file);\n\
      fn();\n\
    })\n\
  }\n\
\n\
  if (entry.isDirectory) {\n\
    var dir = entry.createReader();\n\
    dir.readEntries(function(entries){\n\
      entries = filterHidden(entries);\n\
      var pending = entries.length;\n\
\n\
      for (var i = 0; i < entries.length; i++) {\n\
        walk(e, entries[i], function(){\n\
          --pending || fn();\n\
        });\n\
      }\n\
    })\n\
  }\n\
}\n\
\n\
/**\n\
 * Filter hidden entries.\n\
 *\n\
 * @param {Array} entries\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function filterHidden(entries) {\n\
  var arr = [];\n\
\n\
  for (var i = 0; i < entries.length; i++) {\n\
    if ('.' == entries[i].name[0]) continue;\n\
    arr.push(entries[i]);\n\
  }\n\
\n\
  return arr;\n\
}\n\
//@ sourceURL=component-normalized-upload/index.js"
));
require.register("enome-components-angular-enter-directive/index.js", Function("exports, require, module",
"var mod = window.angular.module('ngEnter', []);\n\
\n\
mod.directive('ngEnter', function ($parse, safeApply) {\n\
\n\
  return function (scope, element, attrs) {\n\
\n\
    element.bind('keydown', function (event) {\n\
\n\
      var fn = $parse(attrs['ngEnter']);\n\
\n\
      if (event.which === 13) {\n\
\n\
        safeApply(scope, function () {\n\
          fn(scope, { $event : event });\n\
        });\n\
\n\
      }\n\
\n\
    });\n\
\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'ngEnter';\n\
//@ sourceURL=enome-components-angular-enter-directive/index.js"
));
require.register("enome-components-angular-droparea/index.js", Function("exports, require, module",
"var mod = window.angular.module('droparea', []);\n\
var normalize = require('normalized-upload');\n\
\n\
mod.directive('droparea', function ($document) {\n\
\n\
  return {\n\
\n\
    restrict: 'E',\n\
    template: '<div class=\"droparea\">Drop</div>',\n\
    replace: true,\n\
    scope: { files: '=' },\n\
    link: function ($scope, el, attrs) {\n\
\n\
      var drags = 0;\n\
\n\
      el.css('display', 'none');\n\
\n\
      window.addEventListener('dragenter', function (e) {\n\
        drags += 1;\n\
        el.css('display', 'block');\n\
      });\n\
\n\
      window.addEventListener('dragleave', function (e) {\n\
        drags -= 1;\n\
        if (drags === 0) {\n\
          el.css('display', 'none');\n\
        }\n\
      });\n\
\n\
      el[0].addEventListener('dragenter', function (e) {\n\
        el.addClass('over');\n\
        e.preventDefault();\n\
        return false;\n\
      });\n\
\n\
      el[0].addEventListener('dragover', function (e) {\n\
        e.preventDefault();\n\
        return false;\n\
      });\n\
\n\
      el[0].addEventListener('dragleave', function (e) {\n\
        el.removeClass('over');\n\
      });\n\
\n\
      el[0].addEventListener('drop', function (e) {\n\
        drags = 0;\n\
\n\
        $scope.files.length = 0;\n\
        normalize(e, function (e) {\n\
          $scope.$apply(function () {\n\
            $scope.files.push.apply($scope.files, e.items);\n\
          });\n\
        });\n\
\n\
        el.css('display', 'none');\n\
        el.removeClass('over');\n\
        e.stopPropagation();\n\
        e.preventDefault();\n\
        return false;\n\
      });\n\
\n\
\n\
    }\n\
\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'droparea';\n\
//@ sourceURL=enome-components-angular-droparea/index.js"
));
require.register("enome-components-angular-safe-apply/index.js", Function("exports, require, module",
"var mod = window.angular.module('safeApply', []);\n\
\n\
mod.factory('safeApply', [ function ($rootScope) {\n\
  return function ($scope, fn) {\n\
    var phase = $scope.$root.$$phase;\n\
    if (phase === '$apply' || phase === '$digest') {\n\
      if (fn) {\n\
        $scope.$eval(fn);\n\
      }\n\
    } else {\n\
      if (fn) {\n\
        $scope.$apply(fn);\n\
      } else {\n\
        $scope.$apply();\n\
      }\n\
    }\n\
  }\n\
}]);\n\
\n\
module.exports = 'safeApply';\n\
//@ sourceURL=enome-components-angular-safe-apply/index.js"
));
require.register("enome-components-angular-file-manager/index.js", Function("exports, require, module",
"require('webfont');\n\
\n\
var mod = window.angular.module('file-manager', [\n\
  require('angular-safe-apply'),\n\
  require('angular-enter-directive'),\n\
  require('angular-droparea'),\n\
  require('./js/breadcrumbs'),\n\
  require('./js/extra-events'),\n\
  require('./js/directories'),\n\
  require('./js/files')\n\
]);\n\
\n\
mod.run(function ($templateCache) {\n\
  window.WebFont.load({ google: { families: ['Roboto Condensed:300'] } });\n\
});\n\
\n\
mod.directive('fileManager', function () {\n\
  return {\n\
    restrict: 'E',\n\
    template: require('./template'),\n\
    replace: true,\n\
    scope: { url: '=', selected: '=selected' },\n\
    controller: function ($scope, $timeout) {\n\
\n\
      if (typeof $scope.selected === 'undefined') {\n\
        $scope.selected = [];\n\
      }\n\
\n\
      $scope.path = '/';\n\
\n\
      $scope.link = function (path) {\n\
        $scope.path = path;\n\
      };\n\
\n\
      $scope.select = function (item, checked) {\n\
\n\
        if (checked) {\n\
          return $scope.selected.push(item.path);\n\
        }\n\
\n\
        $scope.selected.splice($scope.selected.indexOf(item.path), 1);\n\
\n\
      };\n\
\n\
      $scope.update_selected = function (old_path, new_path) {\n\
\n\
        if ($scope.selected.some(function (path) { return path === old_path; })) {\n\
          $scope.selected.splice($scope.selected.indexOf(old_path), 1, new_path);\n\
        }\n\
\n\
      };\n\
\n\
      $scope.remove_selected = function (path) {\n\
\n\
        var i;\n\
        var re = new RegExp('^' + path.replace(/[\\-\\[\\]{}()*+?.,\\\\\\^$|#\\s]/g, \"\\\\$&\") + '($|/)');\n\
\n\
        for (i = $scope.selected.length - 1; i >= 0; i -= 1) {\n\
          if (re.test($scope.selected[i])) {\n\
            $scope.selected.splice(i, 1);\n\
          }\n\
        }\n\
\n\
      };\n\
\n\
      $scope.enableRead = function (i) {\n\
\n\
        if (i.readonly === '') {\n\
          return;\n\
        }\n\
\n\
        if (typeof i.stos === 'undefined') {\n\
          i.stos = [];\n\
        }\n\
\n\
        i.stos.push($timeout(function () {\n\
          i.readonly = '';\n\
        }, 250, true));\n\
\n\
      };\n\
\n\
      $scope.enableReadonly = function (i) {\n\
        i.readonly = 'readonly';\n\
      };\n\
\n\
      $scope.unfocus = function (e) {\n\
        e.target.blur();\n\
      };\n\
\n\
    }\n\
\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'file-manager';\n\
//@ sourceURL=enome-components-angular-file-manager/index.js"
));
require.register("enome-components-angular-file-manager/js/breadcrumbs.js", Function("exports, require, module",
"var mod = window.angular.module('breadcrumbs', []);\n\
\n\
var pathToNavigation = function (path) {\n\
\n\
  var root = { path: '/', name: 'Home' };\n\
\n\
  if (path === '/') {\n\
    return [root];\n\
  }\n\
\n\
  var navigation = [];\n\
\n\
  var i;\n\
  var parts = path.split('/');\n\
  var path_parts = [];\n\
\n\
  parts.forEach(function (current) {\n\
\n\
    if (current === '') {\n\
      navigation.push(root);\n\
    } else {\n\
      path_parts.push(current);\n\
      navigation.push({ name: current, path: '/' + path_parts.join('/') });\n\
    }\n\
\n\
  });\n\
\n\
  return navigation;\n\
\n\
};\n\
\n\
mod.directive('breadCrumbs', function () {\n\
  return {\n\
    restrict: 'E',\n\
    template: '<span ng-repeat=\"part in path_navigation\"> / <button ng-click=\"navigate(part.path)\" title=\"{{part.name}}\">{{ part.name }}</button></span>',\n\
    scope: {\n\
      path: '='\n\
    },\n\
    controller: function ($scope) {\n\
      $scope.$watch('path', function (v) {\n\
        if (v) {\n\
          $scope.path_navigation = pathToNavigation(v);\n\
        }\n\
      });\n\
\n\
      $scope.navigate = function (p) {\n\
        $scope.path = p;\n\
      };\n\
    }\n\
\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'breadcrumbs';\n\
//@ sourceURL=enome-components-angular-file-manager/js/breadcrumbs.js"
));
require.register("enome-components-angular-file-manager/js/extra-events.js", Function("exports, require, module",
"var mod = window.angular.module('extra-events', []);\n\
\n\
mod.directive([ 'focus', 'blur', 'keyup', 'keydown', 'keypress' ].reduce(function (container, name) {\n\
\n\
  var directiveName = 'ng' + name[0].toUpperCase() + name.substr(1);\n\
\n\
  container[directiveName] = ['$parse', 'safeApply', function ($parse, safeApply) {\n\
\n\
    return function (scope, element, attr) {\n\
\n\
      var fn = $parse(attr[directiveName]);\n\
\n\
      element.bind(name, function (event) {\n\
\n\
        safeApply(scope, function () {\n\
          fn(scope, { $event : event });\n\
        });\n\
\n\
        event.stopPropagation();\n\
\n\
      });\n\
\n\
    };\n\
\n\
  }];\n\
\n\
  return container;\n\
\n\
}, {}));\n\
\n\
module.exports = 'extra-events';\n\
//@ sourceURL=enome-components-angular-file-manager/js/extra-events.js"
));
require.register("enome-components-angular-file-manager/js/directories.js", Function("exports, require, module",
"var mod = window.angular.module('directories', []);\n\
\n\
mod.controller('DirectoriesCtrl', function ($scope, $http) {\n\
\n\
  $scope.directories = [];\n\
\n\
  $scope.$watch('path', function (v) {\n\
\n\
    if (!v) { return; }\n\
\n\
    var GET = $http.get($scope.url + '/directories/' + $scope.path);\n\
\n\
    GET.success(function (data, status, headers, config) {\n\
      $scope.directories.length = 0;\n\
      $scope.directories.push.apply($scope.directories, data);\n\
    });\n\
\n\
    GET.error(function (data, status, headers, config) {\n\
      console.log('error');\n\
    });\n\
\n\
  });\n\
\n\
  $scope.create = function (e) {\n\
\n\
    if (!$scope.directory_name) {\n\
      return;\n\
    }\n\
\n\
    var data = {\n\
      path: $scope.path,\n\
      name: $scope.directory_name.replace(/\\//g, '')\n\
    };\n\
\n\
    var contains = $scope.directories.some(function (directory) {\n\
      return directory.path === ($scope.path + '/' + $scope.directory_name).replace('//', '/');\n\
    });\n\
\n\
    if (contains) {\n\
      alert(data.name + ' already exists');\n\
      return;\n\
    }\n\
    \n\
    var POST = $http.post($scope.url + '/directories/', data);\n\
\n\
    POST.success(function (data) {\n\
      $scope.directory_name = '';\n\
      $scope.directories.push(data);\n\
    });\n\
\n\
    POST.error(function () {\n\
      alert('Server error');\n\
    });\n\
\n\
    e.preventDefault();\n\
\n\
  };\n\
\n\
});\n\
\n\
mod.controller('DirectoryCtrl', function ($scope, $http, $timeout) {\n\
\n\
  $scope.directory.readonly = 'readonly';\n\
\n\
  $scope.remove = function (directory) {\n\
    var DEL = $http.delete($scope.url + '/directories/' + directory.path);\n\
\n\
    DEL.success(function (data) {\n\
      var i = $scope.directories.indexOf(directory);\n\
      $scope.directories.splice(i, 1);\n\
      $scope.remove_selected(directory.path);\n\
    });\n\
\n\
    DEL.error(function (data) {\n\
      alert('Server error');\n\
    });\n\
  };\n\
\n\
  $scope.storeName = function (directory) {\n\
    $scope.old_name = directory.name;\n\
  };\n\
\n\
  $scope.update = function (directory) {\n\
\n\
    if (directory.name === '') {\n\
      directory.name = $scope.old_name;\n\
      return;\n\
    }\n\
\n\
    if (directory.name !== $scope.old_name) {\n\
\n\
      var contains = $scope.directories.some(function (f) {\n\
        return f.path === ($scope.path + '/' + directory.name).replace('//', '/');\n\
      });\n\
\n\
      if (contains) {\n\
        alert(directory.name + ' already exists');\n\
        directory.name = $scope.old_name;\n\
        return;\n\
      }\n\
\n\
      var data = {\n\
        path: $scope.path,\n\
        name: directory.name.replace(/\\//g, ''),\n\
        old_name: $scope.old_name\n\
      };\n\
\n\
      var PUT = $http.put($scope.url + '/directories/', data);\n\
\n\
      PUT.success(function (response) {\n\
        $scope.update_selected(directory.path, response.path);\n\
        directory.path = response.path;\n\
        directory.name = response.name;\n\
      });\n\
\n\
      PUT.error(function () {\n\
        directory.name = $scope.old_name;\n\
      });\n\
    }\n\
\n\
    $scope.enableReadonly(directory);\n\
\n\
  };\n\
\n\
  $scope.s = $scope.selected.some(function (path) {\n\
    return $scope.directory.path === path;\n\
  });\n\
\n\
  $scope.visit = function (directory) {\n\
\n\
    if (directory.readonly === '') {\n\
      return;\n\
    }\n\
\n\
    directory.stos.forEach(function (sto) {\n\
      $timeout.cancel(sto);\n\
    });\n\
\n\
    directory.stos.length = 0;\n\
\n\
    $scope.link(directory.path);\n\
\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'directories';\n\
//@ sourceURL=enome-components-angular-file-manager/js/directories.js"
));
require.register("enome-components-angular-file-manager/js/files.js", Function("exports, require, module",
"var mod = window.angular.module('files', []);\n\
var Upload = require('upload');\n\
\n\
mod.controller('FilesCtrl', function ($scope, $http) {\n\
\n\
  $scope.uploaded_files = [];\n\
  $scope.files = [];\n\
\n\
  $scope.$watch('path', function (v) {\n\
\n\
    if (!v) { return; }\n\
\n\
    var GET = $http.get($scope.url + '/files/' + $scope.path);\n\
\n\
    GET.success(function (data, status, headers, config) {\n\
      $scope.files.length = 0;\n\
      $scope.files.push.apply($scope.files, data);\n\
    });\n\
\n\
    GET.error(function (data, status, headers, config) {\n\
      alert('Server Error');\n\
    });\n\
\n\
  });\n\
\n\
  $scope.$watch('uploaded_files.length', function (v) {\n\
\n\
    if (v === 0) { return; }\n\
\n\
    $scope.uploaded_files.forEach(function (file) {\n\
\n\
      if (file.kind !== 'file') { return; }\n\
\n\
      var data = {\n\
        name: file.name,\n\
        path: ($scope.path + '/' + file.name).replace('//', '/'),\n\
        progress: 0,\n\
        uploading: true\n\
      };\n\
\n\
      var contains = $scope.files.some(function (file) {\n\
        return file.path === data.path;\n\
      });\n\
\n\
      if (contains) {\n\
        alert(data.name + ' already exists');\n\
        return;\n\
      }\n\
\n\
      $scope.files.push(data);\n\
\n\
      var upload = new Upload(file);\n\
\n\
      upload.to($scope.url + '/files/' + $scope.path);\n\
\n\
      upload.on('end', function (e) {\n\
        $scope.$apply(function () {\n\
          data.uploading = false;\n\
        });\n\
      });\n\
\n\
      upload.on('error', function (e) {\n\
        alert('Server Error');\n\
      });\n\
\n\
      upload.on('progress', function (e) {\n\
        $scope.$apply(function () {\n\
          data.progress = parseInt(Math.ceil(e.percent), 10);\n\
        });\n\
      });\n\
\n\
    });\n\
\n\
    $scope.uploaded_files.length = 0;\n\
\n\
  });\n\
\n\
});\n\
\n\
mod.controller('FileCtrl', function ($scope, $http, $timeout) {\n\
\n\
  $scope.file.readonly = 'readonly';\n\
\n\
  $scope.remove = function (file) {\n\
\n\
    var DEL = $http.delete($scope.url + '/files/' + file.path);\n\
\n\
    DEL.success(function (data) {\n\
      var i = $scope.files.indexOf(file);\n\
      $scope.files.splice(i, 1);\n\
      $scope.remove_selected(file.path);\n\
    });\n\
\n\
  };\n\
\n\
  $scope.storeName = function (file) {\n\
    $scope.old_name = file.name;\n\
  };\n\
\n\
  $scope.update = function (file) {\n\
\n\
    if (file.name === '') {\n\
      file.name = $scope.old_name;\n\
      return;\n\
    }\n\
\n\
\n\
    if (file.name !== $scope.old_name) {\n\
\n\
      var contains = $scope.files.some(function (f) {\n\
        return f.path === ($scope.path + '/' + file.name).replace('//', '/');\n\
      });\n\
\n\
      if (contains) {\n\
        alert(file.name + ' already exists');\n\
        file.name = $scope.old_name;\n\
        return;\n\
      }\n\
\n\
      var data = {\n\
        path: $scope.path,\n\
        name: file.name.replace(/\\//g, ''),\n\
        old_name: $scope.old_name\n\
      };\n\
\n\
      var PUT = $http.put($scope.url + '/files/', data);\n\
\n\
      PUT.success(function (response) {\n\
        $scope.update_selected(file.path, response.path);\n\
        file.path = response.path;\n\
        file.name = response.name;\n\
      });\n\
\n\
      PUT.error(function () {\n\
        file.name = $scope.old_name;\n\
      });\n\
\n\
    }\n\
\n\
    $scope.enableReadonly($scope.file);\n\
\n\
  };\n\
\n\
  $scope.$watch('selected.length', function () {\n\
    $scope.s = $scope.selected.some(function (path) {\n\
      return $scope.file.path === path;\n\
    });\n\
  });\n\
\n\
  $scope.preview = function (file) {\n\
\n\
    if (file.readonly === '') {\n\
      return;\n\
    }\n\
\n\
    file.stos.forEach(function (sto) {\n\
      $timeout.cancel(sto);\n\
    });\n\
\n\
    file.stos.length = 0;\n\
    window.open($scope.url + '/files/' +  file.path, '_blank');\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'files';\n\
//@ sourceURL=enome-components-angular-file-manager/js/files.js"
));
require.register("enome-components-angular-file-manager/template.js", Function("exports, require, module",
"module.exports = '<div class=\\'file-manager\\'>\\n\
  <header>\\n\
    <bread-crumbs path=\\'path\\'></bread-crumbs>\\n\
  </header>\\n\
\\n\
  <div ng-controller=\\'DirectoriesCtrl\\'>\\n\
\\n\
    <h2><i class=\\'icon-folder-close-alt\\'></i> Directories</h2>\\n\
\\n\
    <div class=\\'row directory_create\\'>\\n\
      <input type=\\'text\\' placeholder=\\'New directory name\\' ng-model=\\'directory_name\\' ng-enter=\\'create($event)\\'/>\\n\
    </div>\\n\
\\n\
    <div class=\\'row\\' ng-controller=\\'DirectoryCtrl\\' ng-repeat=\\'directory in directories\\'>\\n\
\\n\
      <div class=\\'col1\\' ng-click=\\'link(directory.path)\\'>\\n\
        <i class=\\'icon-folder-close-alt\\'></i>\\n\
      </div>\\n\
\\n\
      <div class=\\'col2\\'>\\n\
        <input class=\\'inline\\' type=\\'text\\' \\n\
               ng-model=\\'directory.name\\' \\n\
               ng-focus=\\'storeName(directory)\\' \\n\
               ng-blur=\\'update(directory)\\' \\n\
               ng-readonly=\\'directory.readonly\\' \\n\
               ng-dblclick=\\'visit(directory)\\' \\n\
               ng-enter=\\'unfocus($event)\\'\\n\
               ng-click=\\'enableRead(directory)\\'/>\\n\
  \\n\
      </div>\\n\
\\n\
      <div class=\\'col3\\'>\\n\
        <button ng-click=\\'remove(directory);\\'><i class=\\'icon-trash\\'></i></button>\\n\
      </div>\\n\
\\n\
    </div>\\n\
\\n\
  </div>\\n\
\\n\
  <div ng-controller=\\'FilesCtrl\\' class=\\'files\\'>\\n\
\\n\
    <h2><i class=\\'icon-file-text-alt\\'></i> Files</h2>\\n\
\\n\
    <droparea class=\\'droparea\\' files=\\'uploaded_files\\'></droparea>   \\n\
\\n\
    <div class=\\'row file\\' ng-controller=\\'FileCtrl\\' ng-repeat=\\'file in files\\'>\\n\
\\n\
      <div class=\\'col1\\'>\\n\
        <input type=\\'checkbox\\' ng-change=\\'select(file, s)\\' ng-model=\\'s\\' />\\n\
      </div>\\n\
\\n\
      <div class=\\'col2\\'>\\n\
        <input class=\\'inline\\' type=\\'text\\' \\n\
               ng-model=\\'file.name\\' \\n\
               ng-focus=\\'storeName(file)\\'\\n\
               ng-blur=\\'update(file)\\'\\n\
               ng-readonly=\\'file.readonly\\'\\n\
               ng-enter=\\'unfocus($event)\\'\\n\
               ng-click=\\'enableRead(file)\\'\\n\
               ng-dblclick=\\'preview(file)\\' />\\n\
      </div>\\n\
\\n\
      <div class=\\'col3\\' ng-show=\\'file.uploading\\'>{{file.progress}}%</div>\\n\
\\n\
      <div class=\\'col3\\' ng-show=\\'!file.uploading\\'>\\n\
        <button ng-click=\\'remove(file)\\'><i class=\\'icon-trash\\'></i></button>\\n\
      </div>\\n\
    </div>\\n\
\\n\
  </div>\\n\
\\n\
</div>\\n\
';//@ sourceURL=enome-components-angular-file-manager/template.js"
));
require.register("enome-components-angular-markdown-editor/index.js", Function("exports, require, module",
"require('webfont');\n\
\n\
var mod = window.angular.module('markdown-editor', [\n\
  require('angular-file-manager')\n\
]);\n\
\n\
mod.run(['$templateCache', function ($templateCache) {\n\
  window.WebFont.load({ google: { families: ['Open Sans:300,400,700', 'Droid Serif:400'] } });\n\
}]);\n\
\n\
var directives = require('./src/directives');\n\
var controllers = require('./src/controllers');\n\
var filters = require('./src/filters');\n\
var factories = require('./src/factories');\n\
\n\
mod.directive('markdownEditor', directives.markdownEditor);\n\
mod.controller('MarkdownEditorCtrl', controllers.MarkdownEditorCtrl);\n\
mod.filter('markdown', filters.markdown);\n\
mod.factory('stringBuilder', factories.stringBuilder);\n\
mod.factory('selection', factories.selection);\n\
\n\
module.exports = 'markdown-editor';\n\
//@ sourceURL=enome-components-angular-markdown-editor/index.js"
));
require.register("enome-components-angular-markdown-editor/template.js", Function("exports, require, module",
"module.exports = '<div class=\\'markdowneditor\\'>\\n\
\\n\
  <div class=\\'actionbar\\'>\\n\
    <button ng-click=\\'toggleFileManager()\\' title=\\'Insert images and files\\'>Insert file</button>\\n\
  </div>\\n\
\\n\
  <div class=\\'insert\\'>\\n\
    <textarea ng-model=\\'data\\' autofocus></textarea>\\n\
  </div>\\n\
\\n\
  <div class=\\'preview markdown\\' ng-bind-html-unsafe=\\'data|markdown\\'></div>\\n\
\\n\
  <div ng-show=\\'show_file_manager\\' class=\\'file-manager-overlay\\'>\\n\
    <file-manager url=\\'fileserver\\' selected=\\'selected_files\\'></file-manager>\\n\
    <div class=\\'actions\\'>\\n\
      <button ng-click=\\'insertImage()\\' ng-disabled=\\'!selected_files.length\\'>Insert As Image</button>\\n\
      <button ng-click=\\'insertLink()\\' ng-disabled=\\'!selected_files.length\\'>Insert As Link</button>\\n\
      <button ng-click=\\'toggleFileManager()\\'>Cancel</button>\\n\
    </div>\\n\
  </div>\\n\
\\n\
</div>\\n\
';//@ sourceURL=enome-components-angular-markdown-editor/template.js"
));
require.register("enome-components-angular-markdown-editor/src/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  MarkdownEditorCtrl: function ($scope, $timeout, stringBuilder) {\n\
\n\
    $scope.selected_files = [];\n\
    $scope.show_file_manager = false;\n\
\n\
    $scope.toggle = function () {\n\
      $scope.fullscreen = !$scope.fullscreen;\n\
    };\n\
\n\
    $scope.selection = { start: 0, end: 0 };\n\
\n\
    $scope.toggleFileManager = function () {\n\
      $scope.show_file_manager = !$scope.show_file_manager;\n\
    };\n\
\n\
    var reset = function () {\n\
      $scope.selected_files.length = 0;\n\
      $scope.toggleFileManager();\n\
      $timeout(function () { $scope.focusTextarea(); }, 0);\n\
    };\n\
\n\
    $scope.insertImage = function () {\n\
\n\
      var data = stringBuilder($scope.data, $scope.selection.start, $scope.selection.end);\n\
\n\
      $scope.selected_files.forEach(function (file) {\n\
        data.add('![' + file.split('/').pop() + '](' + $scope.fileserver + window.escape(file) + ')');\n\
      });\n\
\n\
      $scope.data = data.build();\n\
      $scope.selection.end = $scope.selection.start + data.length;\n\
      reset();\n\
\n\
    };\n\
\n\
    $scope.insertLink = function () {\n\
\n\
      var data = stringBuilder($scope.data, $scope.selection.start, $scope.selection.end);\n\
\n\
      $scope.selected_files.forEach(function (file) {\n\
        data.add('[' + file.split('/').pop() + '](' + $scope.fileserver + window.escape(file) + ')');\n\
      });\n\
\n\
      $scope.data = data.build();\n\
      $scope.selection.end = $scope.selection.start + data.length;\n\
      reset();\n\
\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=enome-components-angular-markdown-editor/src/controllers.js"
));
require.register("enome-components-angular-markdown-editor/src/directives.js", Function("exports, require, module",
"var directives = {\n\
\n\
  markdownEditor: function (selection) {\n\
\n\
    return {\n\
      restrict: 'E',\n\
      controller: 'MarkdownEditorCtrl',\n\
      template: require('../template'),\n\
      replace: true,\n\
      scope: { data: '=', fileserver: '=' },\n\
      link: function (scope, element, attr) {\n\
\n\
        if (typeof scope.data === 'undefined') {\n\
          scope.data = '';\n\
        }\n\
\n\
        var textarea = element.find('textarea');\n\
\n\
        textarea.bind('blur', function (e) {\n\
          var self = this;\n\
          scope.$apply(function () {\n\
            scope.selection = { start: self.selectionStart, end: self.selectionEnd };\n\
          });\n\
        });\n\
\n\
        scope.focusTextarea = function () {\n\
          selection.setRange(textarea[0], scope.selection.start, scope.selection.end);\n\
        };\n\
\n\
        // Open links in target='_blank'\n\
        \n\
        element.bind('click', function (e) {\n\
\n\
          if (e.target.tagName === 'A') {\n\
            window.angular.element(e.target).attr('target', '_blank');\n\
          }\n\
\n\
        });\n\
\n\
      }\n\
    };\n\
\n\
  },\n\
\n\
};\n\
\n\
module.exports = directives;\n\
//@ sourceURL=enome-components-angular-markdown-editor/src/directives.js"
));
require.register("enome-components-angular-markdown-editor/src/filters.js", Function("exports, require, module",
"var marked = require('marked');\n\
\n\
var filters = {\n\
\n\
  markdown: function () {\n\
\n\
    return function (input) {\n\
      if (input) {\n\
        return marked(input);\n\
      }\n\
      return '';\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = filters;\n\
//@ sourceURL=enome-components-angular-markdown-editor/src/filters.js"
));
require.register("enome-components-angular-markdown-editor/src/factories.js", Function("exports, require, module",
"var factories = {\n\
\n\
  stringBuilder: function () {\n\
    \n\
    return function (s, selection_start, selection_end) {\n\
\n\
      var start = s.slice(0, selection_start);\n\
      var middle = [];\n\
      var end = s.slice(selection_end);\n\
\n\
      var string_builder = {\n\
\n\
        add: function (s) {\n\
          middle.push(s);\n\
        },\n\
\n\
        build: function () {\n\
\n\
          var m = middle.join('\\n\
');\n\
          string_builder.length = m.length;\n\
\n\
          if (middle.length !== 0) {\n\
            return start + m + end;\n\
          }\n\
\n\
          return s;\n\
\n\
        },\n\
\n\
      };\n\
\n\
      return string_builder;\n\
\n\
    };\n\
\n\
  },\n\
\n\
  selection: function () {\n\
\n\
    return {\n\
\n\
      setRange: function (element, start, end) {\n\
\n\
        if (element.setSelectionRange) {\n\
          element.focus();\n\
          element.setSelectionRange(start, end);\n\
        } else if (element.createTextRange) {\n\
          var range = element.createTextRange();\n\
          range.collapse(true);\n\
          range.moveEnd('character', end);\n\
          range.moveStart('character', start);\n\
          range.select();\n\
        }\n\
      }\n\
\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = factories;\n\
//@ sourceURL=enome-components-angular-markdown-editor/src/factories.js"
));
require.register("enome-components-angular-markdown-textarea/index.js", Function("exports, require, module",
"var mod = window.angular.module('markdown-textarea', [\n\
  require('angular-markdown-editor')\n\
]);\n\
\n\
mod.directive('markdownTextarea', function () {\n\
\n\
  return {\n\
    restrict: 'E',\n\
    template: require('./template'),\n\
    replace: true,\n\
    scope: { data: '=', fileserver: '=' },\n\
    link: function (scope, el, attr) {\n\
      scope.$watch('show_editor', function (v) {\n\
        if (v) {\n\
          window.document.body.style.overflow = 'hidden';\n\
          return;\n\
        }\n\
\n\
        window.document.body.style.overflow = 'inherit';\n\
      });\n\
    },\n\
    controller: function ($scope) {\n\
      $scope.show_editor = false;\n\
\n\
      $scope.toggle = function () {\n\
        $scope.show_editor = !$scope.show_editor;\n\
      };\n\
    }\n\
\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'markdown-textarea';\n\
//@ sourceURL=enome-components-angular-markdown-textarea/index.js"
));
require.register("enome-components-angular-markdown-textarea/template.js", Function("exports, require, module",
"module.exports = '<div class=\\'markdown-textarea\\'>\\n\
  <div class=\\'textarea-container\\'>\\n\
    <button ng-click=\\'toggle()\\' title=\\'Show fullscreen editor\\'><i class=\\'icon-resize-full\\'></i></button>\\n\
    <textarea ng-model=\\'data\\'></textarea>\\n\
  \\n\
  </div>\\n\
  <div class=\\'overlay\\' ng-show=\\'show_editor\\'>\\n\
    <button ng-click=\\'toggle()\\' title=\\'Hide fullscreen editor\\'><i class=\\'icon-resize-small\\'></i></button>\\n\
    <markdown-editor data=\\'data\\' fileserver=\\'fileserver\\' />\\n\
  </div>\\n\
</div>\\n\
';//@ sourceURL=enome-components-angular-markdown-textarea/template.js"
));
require.register("enome-components-angular-arrangeable-array/index.js", Function("exports, require, module",
"// Utils\n\
\n\
var move = function (array, pos1, pos2) {\n\
  var i, tmp;\n\
  pos1 = parseInt(pos1, 10);\n\
  pos2 = parseInt(pos2, 10);\n\
\n\
  if (pos1 !== pos2 && 0 <= pos1 && pos1 <= array.length && 0 <= pos2 && pos2 <= array.length) {\n\
    tmp = array[pos1];\n\
    if (pos1 < pos2) {\n\
      for (i = pos1; i < pos2; i += 1) {\n\
        array[i] = array[i + 1];\n\
      }\n\
    } else {\n\
      for (i = pos1; i > pos2; i -= 1) {\n\
        array[i] = array[i - 1];\n\
      }\n\
    }\n\
    array[pos2] = tmp;\n\
  }\n\
};\n\
\n\
// App\n\
\n\
require('webfont');\n\
\n\
var mod = window.angular.module('arrangeable-array', []);\n\
\n\
mod.directive('arrangeableArray', function ($document) {\n\
\n\
  return {\n\
\n\
    restrict: 'E',\n\
    scope: { array: '=' },\n\
    template: require('./template'),\n\
    replace: true,\n\
    link: function ($scope, root, attrs) {\n\
\n\
      var resetExpand = function () {\n\
        var expanded_dropareas = document.querySelector('.expand');\n\
\n\
        if (expanded_dropareas) {\n\
          expanded_dropareas.classList.remove('expand');\n\
        }\n\
      };\n\
\n\
      // Events\n\
      \n\
      var dragging_row;\n\
      var drop_row;\n\
      \n\
      root.bind('mousedown', function (e) {\n\
\n\
        if (e.target.classList.contains('row') && !e.target.classList.contains('last')) {\n\
          dragging_row = e.target;\n\
        }\n\
\n\
        if (e.target.parentNode.classList && e.target.parentNode.classList.contains('row')) {\n\
          dragging_row = e.target.parentNode;\n\
        }\n\
\n\
        if (dragging_row) {\n\
          dragging_row.style.width = dragging_row.offsetWidth + 'px';\n\
          dragging_row.offsetY = e.pageY - dragging_row.offsetTop; // FF doesn't support offsetY\n\
          root.css('height', dragging_row.parentNode.offsetHeight + 'px');\n\
          \n\
          e.preventDefault();\n\
          return false;\n\
        }\n\
\n\
      });\n\
\n\
      // On drop\n\
\n\
      root.bind('mouseup', function () {\n\
        \n\
        if (dragging_row) {\n\
\n\
          if (drop_row) {\n\
\n\
            $scope.$apply(function () {\n\
\n\
              var pos1 = dragging_row.getAttribute('data-index');\n\
              var pos2 = drop_row.getAttribute('data-index');\n\
\n\
              if (pos1 < pos2) {\n\
                pos2 = pos2 - 1;\n\
              }\n\
\n\
              move($scope.array, pos1, pos2);\n\
\n\
            });\n\
\n\
          }\n\
\n\
          dragging_row.style.zIndex = 0;\n\
          dragging_row.style.position = 'relative';\n\
          dragging_row.style.top = 'inherit';\n\
          dragging_row.style.width = 'inherit';\n\
\n\
          // Reset\n\
\n\
          root.css('height', 'inherit');\n\
          dragging_row = drop_row = null;\n\
          resetExpand();\n\
\n\
        }\n\
\n\
      });\n\
\n\
      root.bind('mousemove', function (e) {\n\
\n\
        if (dragging_row) {\n\
          dragging_row.style.position = 'absolute';\n\
          dragging_row.style.zIndex = 10;\n\
          dragging_row.style.top = (e.pageY - dragging_row.offsetY) + 'px';\n\
\n\
          var rows = root[0].querySelectorAll('.row');\n\
          var pageY = e.pageY - ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);\n\
\n\
          [].forEach.call(rows, function (row) {\n\
\n\
            var cords = row.getBoundingClientRect();\n\
\n\
            if (e.pageX >= cords.left && e.pageX <= cords.right && pageY >= cords.top && pageY <= cords.bottom) {\n\
\n\
              if (row !== dragging_row) {\n\
                drop_row = row;\n\
                resetExpand();\n\
                row.classList.add('expand');\n\
              }\n\
\n\
            }\n\
\n\
          });\n\
\n\
        }\n\
\n\
      });\n\
\n\
    },\n\
\n\
    controller: function ($scope) {\n\
\n\
      $scope.remove = function (item) {\n\
        $scope.array.splice($scope.array.indexOf(item), 1);\n\
      };\n\
\n\
    }\n\
\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'arrangeable-array';\n\
//@ sourceURL=enome-components-angular-arrangeable-array/index.js"
));
require.register("enome-components-angular-arrangeable-array/template.js", Function("exports, require, module",
"module.exports = '<div class=\\'arrangeable-array\\'>\\n\
\\n\
  <div class=\\'row\\' ng-repeat=\\'item in array\\' data-index=\\'{{$index}}\\'>\\n\
    <div class=\\'col1\\'>{{item}}</div>\\n\
    <div class=\\'col2\\'>\\n\
      <button ng-click=\\'remove(item)\\'><i class=\\'icon-remove\\'></i></button>\\n\
    </div>\\n\
  </div>\\n\
\\n\
  <div class=\\'row last\\' data-index=\\'{{array.length}}\\'></div>\\n\
\\n\
</div>\\n\
';//@ sourceURL=enome-components-angular-arrangeable-array/template.js"
));
require.register("enome-components-angular-arrangeable-files/index.js", Function("exports, require, module",
"var mod = window.angular.module('arrangeable-files', [ require('angular-file-manager'), require('angular-arrangeable-array') ]);\n\
\n\
mod.directive('arrangeableFiles', function () {\n\
\n\
  return {\n\
    restrict: 'E',\n\
    scope: { selected: '=', fileserver: '=' },\n\
    template: require('./template'),\n\
    link: function (scope) {\n\
      scope.$watch('full_screen', function (v) {\n\
        if (v) {\n\
          window.document.body.style.overflow = 'hidden';\n\
          return;\n\
        }\n\
\n\
        window.document.body.style.overflow = 'inherit';\n\
      });\n\
    },\n\
    controller: function ($scope) { $scope.full_screen = false; }\n\
  };\n\
\n\
});\n\
\n\
module.exports = 'arrangeable-files';\n\
//@ sourceURL=enome-components-angular-arrangeable-files/index.js"
));
require.register("enome-components-angular-arrangeable-files/template.js", Function("exports, require, module",
"module.exports = '<div class=\\'arrangeable-files\\'>\\n\
\\n\
  <div class=\\'default\\' ng-show=\\'!full_screen\\'>\\n\
    <div class=\\'header\\'>\\n\
      <button ng-click=\\'full_screen = !full_screen\\'>Select files</button>\\n\
    </div>\\n\
\\n\
    <arrangeable-array array=\\'selected\\'></arrangeable-array>\\n\
  </div>\\n\
\\n\
  <div class=\\'overlay\\' ng-show=\\'full_screen\\'>\\n\
    <file-manager selected=\\'selected\\' url=\\'fileserver\\'></file-manager>\\n\
    <button ng-click=\\'full_screen = !full_screen\\'>Close</button>\\n\
  </div>\\n\
\\n\
</div>\\n\
';//@ sourceURL=enome-components-angular-arrangeable-files/template.js"
));

require.register("enome-oar/index.js", Function("exports, require, module",
"var oar = function (base) {\n\
\n\
  var arr = base || [];\n\
  var handlers = {};\n\
  var nextTick = typeof process !== 'undefined' ? process.nextTick : setTimeout;\n\
\n\
  Object.defineProperty(arr, 'on', { value:  function (event, callback) {\n\
    if (typeof handlers[event] === 'undefined') {\n\
      handlers[event] = [];\n\
    }\n\
    handlers[event].push(callback);\n\
  }});\n\
\n\
  var proxy = function (method) {\n\
\n\
    var args = Array.prototype.slice.call(arguments, 1);\n\
    var result = Array.prototype[method].apply(arr, args);\n\
\n\
    nextTick(function () {\n\
      if (typeof handlers[method] !== 'undefined') {\n\
        handlers[method].forEach(function (handler) {\n\
          handler(arr);\n\
        });\n\
      }\n\
    }, 0);\n\
\n\
    return result;\n\
\n\
  };\n\
\n\
  [ 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift' ].forEach(function (method) {\n\
    Object.defineProperty(arr, method, { value: proxy.bind(null, method) });\n\
  });\n\
\n\
  return arr;\n\
\n\
};\n\
\n\
module.exports = oar;\n\
//@ sourceURL=enome-oar/index.js"
));
require.register("component-trim/index.js", Function("exports, require, module",
"\n\
exports = module.exports = trim;\n\
\n\
function trim(str){\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
}\n\
\n\
exports.left = function(str){\n\
  return str.replace(/^\\s*/, '');\n\
};\n\
\n\
exports.right = function(str){\n\
  return str.replace(/\\s*$/, '');\n\
};\n\
//@ sourceURL=component-trim/index.js"
));
require.register("component-querystring/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var trim = require('trim');\n\
\n\
/**\n\
 * Parse the given query `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
exports.parse = function(str){\n\
  if ('string' != typeof str) return {};\n\
\n\
  str = trim(str);\n\
  if ('' == str) return {};\n\
\n\
  var obj = {};\n\
  var pairs = str.split('&');\n\
  for (var i = 0; i < pairs.length; i++) {\n\
    var parts = pairs[i].split('=');\n\
    obj[parts[0]] = null == parts[1]\n\
      ? ''\n\
      : decodeURIComponent(parts[1]);\n\
  }\n\
\n\
  return obj;\n\
};\n\
\n\
/**\n\
 * Stringify the given `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
exports.stringify = function(obj){\n\
  if (!obj) return '';\n\
  var pairs = [];\n\
  for (var key in obj) {\n\
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));\n\
  }\n\
  return pairs.join('&');\n\
};\n\
//@ sourceURL=component-querystring/index.js"
));
require.register("component-underscore/index.js", Function("exports, require, module",
"//     Underscore.js 1.3.3\n\
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.\n\
//     Underscore is freely distributable under the MIT license.\n\
//     Portions of Underscore are inspired or borrowed from Prototype,\n\
//     Oliver Steele's Functional, and John Resig's Micro-Templating.\n\
//     For all details and documentation:\n\
//     http://documentcloud.github.com/underscore\n\
\n\
(function() {\n\
\n\
  // Baseline setup\n\
  // --------------\n\
\n\
  // Establish the root object, `window` in the browser, or `global` on the server.\n\
  var root = this;\n\
\n\
  // Save the previous value of the `_` variable.\n\
  var previousUnderscore = root._;\n\
\n\
  // Establish the object that gets returned to break out of a loop iteration.\n\
  var breaker = {};\n\
\n\
  // Save bytes in the minified (but not gzipped) version:\n\
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;\n\
\n\
  // Create quick reference variables for speed access to core prototypes.\n\
  var push             = ArrayProto.push,\n\
      slice            = ArrayProto.slice,\n\
      unshift          = ArrayProto.unshift,\n\
      toString         = ObjProto.toString,\n\
      hasOwnProperty   = ObjProto.hasOwnProperty;\n\
\n\
  // All **ECMAScript 5** native function implementations that we hope to use\n\
  // are declared here.\n\
  var\n\
    nativeForEach      = ArrayProto.forEach,\n\
    nativeMap          = ArrayProto.map,\n\
    nativeReduce       = ArrayProto.reduce,\n\
    nativeReduceRight  = ArrayProto.reduceRight,\n\
    nativeFilter       = ArrayProto.filter,\n\
    nativeEvery        = ArrayProto.every,\n\
    nativeSome         = ArrayProto.some,\n\
    nativeIndexOf      = ArrayProto.indexOf,\n\
    nativeLastIndexOf  = ArrayProto.lastIndexOf,\n\
    nativeIsArray      = Array.isArray,\n\
    nativeKeys         = Object.keys,\n\
    nativeBind         = FuncProto.bind;\n\
\n\
  // Create a safe reference to the Underscore object for use below.\n\
  var _ = function(obj) { return new wrapper(obj); };\n\
\n\
  // Export the Underscore object for **Node.js**, with\n\
  // backwards-compatibility for the old `require()` API. If we're in\n\
  // the browser, add `_` as a global object via a string identifier,\n\
  // for Closure Compiler \"advanced\" mode.\n\
  if (typeof exports !== 'undefined') {\n\
    if (typeof module !== 'undefined' && module.exports) {\n\
      exports = module.exports = _;\n\
    }\n\
    exports._ = _;\n\
  } else {\n\
    root['_'] = _;\n\
  }\n\
\n\
  // Current version.\n\
  _.VERSION = '1.3.3';\n\
\n\
  // Collection Functions\n\
  // --------------------\n\
\n\
  // The cornerstone, an `each` implementation, aka `forEach`.\n\
  // Handles objects with the built-in `forEach`, arrays, and raw objects.\n\
  // Delegates to **ECMAScript 5**'s native `forEach` if available.\n\
  var each = _.each = _.forEach = function(obj, iterator, context) {\n\
    if (obj == null) return;\n\
    if (nativeForEach && obj.forEach === nativeForEach) {\n\
      obj.forEach(iterator, context);\n\
    } else if (obj.length === +obj.length) {\n\
      for (var i = 0, l = obj.length; i < l; i++) {\n\
        if (iterator.call(context, obj[i], i, obj) === breaker) return;\n\
      }\n\
    } else {\n\
      for (var key in obj) {\n\
        if (_.has(obj, key)) {\n\
          if (iterator.call(context, obj[key], key, obj) === breaker) return;\n\
        }\n\
      }\n\
    }\n\
  };\n\
\n\
  // Return the results of applying the iterator to each element.\n\
  // Delegates to **ECMAScript 5**'s native `map` if available.\n\
  _.map = _.collect = function(obj, iterator, context) {\n\
    var results = [];\n\
    if (obj == null) return results;\n\
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      results[results.length] = iterator.call(context, value, index, list);\n\
    });\n\
    return results;\n\
  };\n\
\n\
  // **Reduce** builds up a single result from a list of values, aka `inject`,\n\
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.\n\
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {\n\
    var initial = arguments.length > 2;\n\
    if (obj == null) obj = [];\n\
    if (nativeReduce && obj.reduce === nativeReduce) {\n\
      if (context) iterator = _.bind(iterator, context);\n\
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);\n\
    }\n\
    each(obj, function(value, index, list) {\n\
      if (!initial) {\n\
        memo = value;\n\
        initial = true;\n\
      } else {\n\
        memo = iterator.call(context, memo, value, index, list);\n\
      }\n\
    });\n\
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');\n\
    return memo;\n\
  };\n\
\n\
  // The right-associative version of reduce, also known as `foldr`.\n\
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.\n\
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {\n\
    var initial = arguments.length > 2;\n\
    if (obj == null) obj = [];\n\
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {\n\
      if (context) iterator = _.bind(iterator, context);\n\
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);\n\
    }\n\
    var reversed = _.toArray(obj).reverse();\n\
    if (context && !initial) iterator = _.bind(iterator, context);\n\
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);\n\
  };\n\
\n\
  // Return the first value which passes a truth test. Aliased as `detect`.\n\
  _.find = _.detect = function(obj, iterator, context) {\n\
    var result;\n\
    any(obj, function(value, index, list) {\n\
      if (iterator.call(context, value, index, list)) {\n\
        result = value;\n\
        return true;\n\
      }\n\
    });\n\
    return result;\n\
  };\n\
\n\
  // Return all the elements that pass a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `filter` if available.\n\
  // Aliased as `select`.\n\
  _.filter = _.select = function(obj, iterator, context) {\n\
    var results = [];\n\
    if (obj == null) return results;\n\
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      if (iterator.call(context, value, index, list)) results[results.length] = value;\n\
    });\n\
    return results;\n\
  };\n\
\n\
  // Return all the elements for which a truth test fails.\n\
  _.reject = function(obj, iterator, context) {\n\
    var results = [];\n\
    if (obj == null) return results;\n\
    each(obj, function(value, index, list) {\n\
      if (!iterator.call(context, value, index, list)) results[results.length] = value;\n\
    });\n\
    return results;\n\
  };\n\
\n\
  // Determine whether all of the elements match a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `every` if available.\n\
  // Aliased as `all`.\n\
  _.every = _.all = function(obj, iterator, context) {\n\
    var result = true;\n\
    if (obj == null) return result;\n\
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;\n\
    });\n\
    return !!result;\n\
  };\n\
\n\
  // Determine if at least one element in the object matches a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `some` if available.\n\
  // Aliased as `any`.\n\
  var any = _.some = _.any = function(obj, iterator, context) {\n\
    iterator || (iterator = _.identity);\n\
    var result = false;\n\
    if (obj == null) return result;\n\
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      if (result || (result = iterator.call(context, value, index, list))) return breaker;\n\
    });\n\
    return !!result;\n\
  };\n\
\n\
  // Determine if a given value is included in the array or object using `===`.\n\
  // Aliased as `contains`.\n\
  _.include = _.contains = function(obj, target) {\n\
    var found = false;\n\
    if (obj == null) return found;\n\
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;\n\
    found = any(obj, function(value) {\n\
      return value === target;\n\
    });\n\
    return found;\n\
  };\n\
\n\
  // Invoke a method (with arguments) on every item in a collection.\n\
  _.invoke = function(obj, method) {\n\
    var args = slice.call(arguments, 2);\n\
    return _.map(obj, function(value) {\n\
      return (_.isFunction(method) ? method : value[method]).apply(value, args);\n\
    });\n\
  };\n\
\n\
  // Convenience version of a common use case of `map`: fetching a property.\n\
  _.pluck = function(obj, key) {\n\
    return _.map(obj, function(value){ return value[key]; });\n\
  };\n\
\n\
  // Return the maximum element or (element-based computation).\n\
  // Can't optimize arrays of integers longer than 65,535 elements.\n\
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797\n\
  _.max = function(obj, iterator, context) {\n\
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n\
      return Math.max.apply(Math, obj);\n\
    }\n\
    if (!iterator && _.isEmpty(obj)) return -Infinity;\n\
    var result = {computed : -Infinity};\n\
    each(obj, function(value, index, list) {\n\
      var computed = iterator ? iterator.call(context, value, index, list) : value;\n\
      computed >= result.computed && (result = {value : value, computed : computed});\n\
    });\n\
    return result.value;\n\
  };\n\
\n\
  // Return the minimum element (or element-based computation).\n\
  _.min = function(obj, iterator, context) {\n\
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n\
      return Math.min.apply(Math, obj);\n\
    }\n\
    if (!iterator && _.isEmpty(obj)) return Infinity;\n\
    var result = {computed : Infinity};\n\
    each(obj, function(value, index, list) {\n\
      var computed = iterator ? iterator.call(context, value, index, list) : value;\n\
      computed < result.computed && (result = {value : value, computed : computed});\n\
    });\n\
    return result.value;\n\
  };\n\
\n\
  // Shuffle an array.\n\
  _.shuffle = function(obj) {\n\
    var rand;\n\
    var index = 0;\n\
    var shuffled = [];\n\
    each(obj, function(value) {\n\
      rand = Math.floor(Math.random() * ++index);\n\
      shuffled[index - 1] = shuffled[rand];\n\
      shuffled[rand] = value;\n\
    });\n\
    return shuffled;\n\
  };\n\
\n\
  // Sort the object's values by a criterion produced by an iterator.\n\
  _.sortBy = function(obj, val, context) {\n\
    var iterator = lookupIterator(obj, val);\n\
    return _.pluck(_.map(obj, function(value, index, list) {\n\
      return {\n\
        value : value,\n\
        criteria : iterator.call(context, value, index, list)\n\
      };\n\
    }).sort(function(left, right) {\n\
      var a = left.criteria, b = right.criteria;\n\
      if (a === void 0) return 1;\n\
      if (b === void 0) return -1;\n\
      return a < b ? -1 : a > b ? 1 : 0;\n\
    }), 'value');\n\
  };\n\
\n\
  // An internal function to generate lookup iterators.\n\
  var lookupIterator = function(obj, val) {\n\
    return _.isFunction(val) ? val : function(obj) { return obj[val]; };\n\
  };\n\
\n\
  // An internal function used for aggregate \"group by\" operations.\n\
  var group = function(obj, val, behavior) {\n\
    var result = {};\n\
    var iterator = lookupIterator(obj, val);\n\
    each(obj, function(value, index) {\n\
      var key = iterator(value, index);\n\
      behavior(result, key, value);\n\
    });\n\
    return result;\n\
  };\n\
\n\
  // Groups the object's values by a criterion. Pass either a string attribute\n\
  // to group by, or a function that returns the criterion.\n\
  _.groupBy = function(obj, val) {\n\
    return group(obj, val, function(result, key, value) {\n\
      (result[key] || (result[key] = [])).push(value);\n\
    });\n\
  };\n\
\n\
  // Counts instances of an object that group by a certain criterion. Pass\n\
  // either a string attribute to count by, or a function that returns the\n\
  // criterion.\n\
  _.countBy = function(obj, val) {\n\
    return group(obj, val, function(result, key, value) {\n\
      result[key] || (result[key] = 0);\n\
      result[key]++;\n\
    });\n\
  };\n\
\n\
  // Use a comparator function to figure out the smallest index at which\n\
  // an object should be inserted so as to maintain order. Uses binary search.\n\
  _.sortedIndex = function(array, obj, iterator) {\n\
    iterator || (iterator = _.identity);\n\
    var value = iterator(obj);\n\
    var low = 0, high = array.length;\n\
    while (low < high) {\n\
      var mid = (low + high) >> 1;\n\
      iterator(array[mid]) < value ? low = mid + 1 : high = mid;\n\
    }\n\
    return low;\n\
  };\n\
\n\
  // Safely convert anything iterable into a real, live array.\n\
  _.toArray = function(obj) {\n\
    if (!obj)                                     return [];\n\
    if (_.isArray(obj))                           return slice.call(obj);\n\
    if (_.isArguments(obj))                       return slice.call(obj);\n\
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();\n\
    return _.values(obj);\n\
  };\n\
\n\
  // Return the number of elements in an object.\n\
  _.size = function(obj) {\n\
    return _.isArray(obj) ? obj.length : _.keys(obj).length;\n\
  };\n\
\n\
  // Array Functions\n\
  // ---------------\n\
\n\
  // Get the first element of an array. Passing **n** will return the first N\n\
  // values in the array. Aliased as `head` and `take`. The **guard** check\n\
  // allows it to work with `_.map`.\n\
  _.first = _.head = _.take = function(array, n, guard) {\n\
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];\n\
  };\n\
\n\
  // Returns everything but the last entry of the array. Especially useful on\n\
  // the arguments object. Passing **n** will return all the values in\n\
  // the array, excluding the last N. The **guard** check allows it to work with\n\
  // `_.map`.\n\
  _.initial = function(array, n, guard) {\n\
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));\n\
  };\n\
\n\
  // Get the last element of an array. Passing **n** will return the last N\n\
  // values in the array. The **guard** check allows it to work with `_.map`.\n\
  _.last = function(array, n, guard) {\n\
    if ((n != null) && !guard) {\n\
      return slice.call(array, Math.max(array.length - n, 0));\n\
    } else {\n\
      return array[array.length - 1];\n\
    }\n\
  };\n\
\n\
  // Returns everything but the first entry of the array. Aliased as `tail`.\n\
  // Especially useful on the arguments object. Passing an **index** will return\n\
  // the rest of the values in the array from that index onward. The **guard**\n\
  // check allows it to work with `_.map`.\n\
  _.rest = _.tail = function(array, index, guard) {\n\
    return slice.call(array, (index == null) || guard ? 1 : index);\n\
  };\n\
\n\
  // Trim out all falsy values from an array.\n\
  _.compact = function(array) {\n\
    return _.filter(array, function(value){ return !!value; });\n\
  };\n\
\n\
  // Internal implementation of a recursive `flatten` function.\n\
  var flatten = function(input, shallow, output) {\n\
    each(input, function(value) {\n\
      if (_.isArray(value)) {\n\
        shallow ? push.apply(output, value) : flatten(value, shallow, output);\n\
      } else {\n\
        output.push(value);\n\
      }\n\
    });\n\
    return output;\n\
  };\n\
\n\
  // Return a completely flattened version of an array.\n\
  _.flatten = function(array, shallow) {\n\
    return flatten(array, shallow, []);\n\
  };\n\
\n\
  // Return a version of the array that does not contain the specified value(s).\n\
  _.without = function(array) {\n\
    return _.difference(array, slice.call(arguments, 1));\n\
  };\n\
\n\
  // Produce a duplicate-free version of the array. If the array has already\n\
  // been sorted, you have the option of using a faster algorithm.\n\
  // Aliased as `unique`.\n\
  _.uniq = _.unique = function(array, isSorted, iterator) {\n\
    var initial = iterator ? _.map(array, iterator) : array;\n\
    var results = [];\n\
    _.reduce(initial, function(memo, value, index) {\n\
      if (isSorted ? (_.last(memo) !== value || !memo.length) : !_.include(memo, value)) {\n\
        memo.push(value);\n\
        results.push(array[index]);\n\
      }\n\
      return memo;\n\
    }, []);\n\
    return results;\n\
  };\n\
\n\
  // Produce an array that contains the union: each distinct element from all of\n\
  // the passed-in arrays.\n\
  _.union = function() {\n\
    return _.uniq(flatten(arguments, true, []));\n\
  };\n\
\n\
  // Produce an array that contains every item shared between all the\n\
  // passed-in arrays.\n\
  _.intersection = function(array) {\n\
    var rest = slice.call(arguments, 1);\n\
    return _.filter(_.uniq(array), function(item) {\n\
      return _.every(rest, function(other) {\n\
        return _.indexOf(other, item) >= 0;\n\
      });\n\
    });\n\
  };\n\
\n\
  // Take the difference between one array and a number of other arrays.\n\
  // Only the elements present in just the first array will remain.\n\
  _.difference = function(array) {\n\
    var rest = flatten(slice.call(arguments, 1), true, []);\n\
    return _.filter(array, function(value){ return !_.include(rest, value); });\n\
  };\n\
\n\
  // Zip together multiple lists into a single array -- elements that share\n\
  // an index go together.\n\
  _.zip = function() {\n\
    var args = slice.call(arguments);\n\
    var length = _.max(_.pluck(args, 'length'));\n\
    var results = new Array(length);\n\
    for (var i = 0; i < length; i++) {\n\
      results[i] = _.pluck(args, \"\" + i);\n\
    }\n\
    return results;\n\
  };\n\
\n\
  // Zip together two arrays -- an array of keys and an array of values -- into\n\
  // a single object.\n\
  _.zipObject = function(keys, values) {\n\
    var result = {};\n\
    for (var i = 0, l = keys.length; i < l; i++) {\n\
      result[keys[i]] = values[i];\n\
    }\n\
    return result;\n\
  };\n\
\n\
  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),\n\
  // we need this function. Return the position of the first occurrence of an\n\
  // item in an array, or -1 if the item is not included in the array.\n\
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.\n\
  // If the array is large and already in sort order, pass `true`\n\
  // for **isSorted** to use binary search.\n\
  _.indexOf = function(array, item, isSorted) {\n\
    if (array == null) return -1;\n\
    var i, l;\n\
    if (isSorted) {\n\
      i = _.sortedIndex(array, item);\n\
      return array[i] === item ? i : -1;\n\
    }\n\
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);\n\
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;\n\
    return -1;\n\
  };\n\
\n\
  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.\n\
  _.lastIndexOf = function(array, item) {\n\
    if (array == null) return -1;\n\
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);\n\
    var i = array.length;\n\
    while (i--) if (array[i] === item) return i;\n\
    return -1;\n\
  };\n\
\n\
  // Generate an integer Array containing an arithmetic progression. A port of\n\
  // the native Python `range()` function. See\n\
  // [the Python documentation](http://docs.python.org/library/functions.html#range).\n\
  _.range = function(start, stop, step) {\n\
    if (arguments.length <= 1) {\n\
      stop = start || 0;\n\
      start = 0;\n\
    }\n\
    step = arguments[2] || 1;\n\
\n\
    var len = Math.max(Math.ceil((stop - start) / step), 0);\n\
    var idx = 0;\n\
    var range = new Array(len);\n\
\n\
    while(idx < len) {\n\
      range[idx++] = start;\n\
      start += step;\n\
    }\n\
\n\
    return range;\n\
  };\n\
\n\
  // Function (ahem) Functions\n\
  // ------------------\n\
\n\
  // Reusable constructor function for prototype setting.\n\
  var ctor = function(){};\n\
\n\
  // Create a function bound to a given object (assigning `this`, and arguments,\n\
  // optionally). Binding with arguments is also known as `curry`.\n\
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.\n\
  // We check for `func.bind` first, to fail fast when `func` is undefined.\n\
  _.bind = function bind(func, context) {\n\
    var bound, args;\n\
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));\n\
    if (!_.isFunction(func)) throw new TypeError;\n\
    args = slice.call(arguments, 2);\n\
    return bound = function() {\n\
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));\n\
      ctor.prototype = func.prototype;\n\
      var self = new ctor;\n\
      var result = func.apply(self, args.concat(slice.call(arguments)));\n\
      if (Object(result) === result) return result;\n\
      return self;\n\
    };\n\
  };\n\
\n\
  // Bind all of an object's methods to that object. Useful for ensuring that\n\
  // all callbacks defined on an object belong to it.\n\
  _.bindAll = function(obj) {\n\
    var funcs = slice.call(arguments, 1);\n\
    if (funcs.length == 0) funcs = _.functions(obj);\n\
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });\n\
    return obj;\n\
  };\n\
\n\
  // Memoize an expensive function by storing its results.\n\
  _.memoize = function(func, hasher) {\n\
    var memo = {};\n\
    hasher || (hasher = _.identity);\n\
    return function() {\n\
      var key = hasher.apply(this, arguments);\n\
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));\n\
    };\n\
  };\n\
\n\
  // Delays a function for the given number of milliseconds, and then calls\n\
  // it with the arguments supplied.\n\
  _.delay = function(func, wait) {\n\
    var args = slice.call(arguments, 2);\n\
    return setTimeout(function(){ return func.apply(null, args); }, wait);\n\
  };\n\
\n\
  // Defers a function, scheduling it to run after the current call stack has\n\
  // cleared.\n\
  _.defer = function(func) {\n\
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));\n\
  };\n\
\n\
  // Returns a function, that, when invoked, will only be triggered at most once\n\
  // during a given window of time.\n\
  _.throttle = function(func, wait) {\n\
    var context, args, timeout, throttling, more, result;\n\
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);\n\
    return function() {\n\
      context = this; args = arguments;\n\
      var later = function() {\n\
        timeout = null;\n\
        if (more) func.apply(context, args);\n\
        whenDone();\n\
      };\n\
      if (!timeout) timeout = setTimeout(later, wait);\n\
      if (throttling) {\n\
        more = true;\n\
      } else {\n\
        throttling = true;\n\
        result = func.apply(context, args);\n\
      }\n\
      whenDone();\n\
      return result;\n\
    };\n\
  };\n\
\n\
  // Returns a function, that, as long as it continues to be invoked, will not\n\
  // be triggered. The function will be called after it stops being called for\n\
  // N milliseconds. If `immediate` is passed, trigger the function on the\n\
  // leading edge, instead of the trailing.\n\
  _.debounce = function(func, wait, immediate) {\n\
    var timeout;\n\
    return function() {\n\
      var context = this, args = arguments;\n\
      var later = function() {\n\
        timeout = null;\n\
        if (!immediate) func.apply(context, args);\n\
      };\n\
      var callNow = immediate && !timeout;\n\
      clearTimeout(timeout);\n\
      timeout = setTimeout(later, wait);\n\
      if (callNow) func.apply(context, args);\n\
    };\n\
  };\n\
\n\
  // Returns a function that will be executed at most one time, no matter how\n\
  // often you call it. Useful for lazy initialization.\n\
  _.once = function(func) {\n\
    var ran = false, memo;\n\
    return function() {\n\
      if (ran) return memo;\n\
      ran = true;\n\
      return memo = func.apply(this, arguments);\n\
    };\n\
  };\n\
\n\
  // Returns the first function passed as an argument to the second,\n\
  // allowing you to adjust arguments, run code before and after, and\n\
  // conditionally execute the original function.\n\
  _.wrap = function(func, wrapper) {\n\
    return function() {\n\
      var args = [func].concat(slice.call(arguments, 0));\n\
      return wrapper.apply(this, args);\n\
    };\n\
  };\n\
\n\
  // Returns a function that is the composition of a list of functions, each\n\
  // consuming the return value of the function that follows.\n\
  _.compose = function() {\n\
    var funcs = arguments;\n\
    return function() {\n\
      var args = arguments;\n\
      for (var i = funcs.length - 1; i >= 0; i--) {\n\
        args = [funcs[i].apply(this, args)];\n\
      }\n\
      return args[0];\n\
    };\n\
  };\n\
\n\
  // Returns a function that will only be executed after being called N times.\n\
  _.after = function(times, func) {\n\
    if (times <= 0) return func();\n\
    return function() {\n\
      if (--times < 1) {\n\
        return func.apply(this, arguments);\n\
      }\n\
    };\n\
  };\n\
\n\
  // Object Functions\n\
  // ----------------\n\
\n\
  // Retrieve the names of an object's properties.\n\
  // Delegates to **ECMAScript 5**'s native `Object.keys`\n\
  _.keys = nativeKeys || function(obj) {\n\
    if (obj !== Object(obj)) throw new TypeError('Invalid object');\n\
    var keys = [];\n\
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;\n\
    return keys;\n\
  };\n\
\n\
  // Retrieve the values of an object's properties.\n\
  _.values = function(obj) {\n\
    return _.map(obj, _.identity);\n\
  };\n\
\n\
  // Return a sorted list of the function names available on the object.\n\
  // Aliased as `methods`\n\
  _.functions = _.methods = function(obj) {\n\
    var names = [];\n\
    for (var key in obj) {\n\
      if (_.isFunction(obj[key])) names.push(key);\n\
    }\n\
    return names.sort();\n\
  };\n\
\n\
  // Extend a given object with all the properties in passed-in object(s).\n\
  _.extend = function(obj) {\n\
    each(slice.call(arguments, 1), function(source) {\n\
      for (var prop in source) {\n\
        obj[prop] = source[prop];\n\
      }\n\
    });\n\
    return obj;\n\
  };\n\
\n\
  // Return a copy of the object only containing the whitelisted properties.\n\
  _.pick = function(obj) {\n\
    var result = {};\n\
    each(flatten(slice.call(arguments, 1), true, []), function(key) {\n\
      if (key in obj) result[key] = obj[key];\n\
    });\n\
    return result;\n\
  };\n\
\n\
  // Fill in a given object with default properties.\n\
  _.defaults = function(obj) {\n\
    each(slice.call(arguments, 1), function(source) {\n\
      for (var prop in source) {\n\
        if (obj[prop] == null) obj[prop] = source[prop];\n\
      }\n\
    });\n\
    return obj;\n\
  };\n\
\n\
  // Create a (shallow-cloned) duplicate of an object.\n\
  _.clone = function(obj) {\n\
    if (!_.isObject(obj)) return obj;\n\
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);\n\
  };\n\
\n\
  // Invokes interceptor with the obj, and then returns obj.\n\
  // The primary purpose of this method is to \"tap into\" a method chain, in\n\
  // order to perform operations on intermediate results within the chain.\n\
  _.tap = function(obj, interceptor) {\n\
    interceptor(obj);\n\
    return obj;\n\
  };\n\
\n\
  // Internal recursive comparison function for `isEqual`.\n\
  var eq = function(a, b, stack) {\n\
    // Identical objects are equal. `0 === -0`, but they aren't identical.\n\
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.\n\
    if (a === b) return a !== 0 || 1 / a == 1 / b;\n\
    // A strict comparison is necessary because `null == undefined`.\n\
    if (a == null || b == null) return a === b;\n\
    // Unwrap any wrapped objects.\n\
    if (a._chain) a = a._wrapped;\n\
    if (b._chain) b = b._wrapped;\n\
    // Invoke a custom `isEqual` method if one is provided.\n\
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);\n\
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);\n\
    // Compare `[[Class]]` names.\n\
    var className = toString.call(a);\n\
    if (className != toString.call(b)) return false;\n\
    switch (className) {\n\
      // Strings, numbers, dates, and booleans are compared by value.\n\
      case '[object String]':\n\
        // Primitives and their corresponding object wrappers are equivalent; thus, `\"5\"` is\n\
        // equivalent to `new String(\"5\")`.\n\
        return a == String(b);\n\
      case '[object Number]':\n\
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for\n\
        // other numeric values.\n\
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);\n\
      case '[object Date]':\n\
      case '[object Boolean]':\n\
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their\n\
        // millisecond representations. Note that invalid dates with millisecond representations\n\
        // of `NaN` are not equivalent.\n\
        return +a == +b;\n\
      // RegExps are compared by their source patterns and flags.\n\
      case '[object RegExp]':\n\
        return a.source == b.source &&\n\
               a.global == b.global &&\n\
               a.multiline == b.multiline &&\n\
               a.ignoreCase == b.ignoreCase;\n\
    }\n\
    if (typeof a != 'object' || typeof b != 'object') return false;\n\
    // Assume equality for cyclic structures. The algorithm for detecting cyclic\n\
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.\n\
    var length = stack.length;\n\
    while (length--) {\n\
      // Linear search. Performance is inversely proportional to the number of\n\
      // unique nested structures.\n\
      if (stack[length] == a) return true;\n\
    }\n\
    // Add the first object to the stack of traversed objects.\n\
    stack.push(a);\n\
    var size = 0, result = true;\n\
    // Recursively compare objects and arrays.\n\
    if (className == '[object Array]') {\n\
      // Compare array lengths to determine if a deep comparison is necessary.\n\
      size = a.length;\n\
      result = size == b.length;\n\
      if (result) {\n\
        // Deep compare the contents, ignoring non-numeric properties.\n\
        while (size--) {\n\
          // Ensure commutative equality for sparse arrays.\n\
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;\n\
        }\n\
      }\n\
    } else {\n\
      // Objects with different constructors are not equivalent.\n\
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;\n\
      // Deep compare objects.\n\
      for (var key in a) {\n\
        if (_.has(a, key)) {\n\
          // Count the expected number of properties.\n\
          size++;\n\
          // Deep compare each member.\n\
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;\n\
        }\n\
      }\n\
      // Ensure that both objects contain the same number of properties.\n\
      if (result) {\n\
        for (key in b) {\n\
          if (_.has(b, key) && !(size--)) break;\n\
        }\n\
        result = !size;\n\
      }\n\
    }\n\
    // Remove the first object from the stack of traversed objects.\n\
    stack.pop();\n\
    return result;\n\
  };\n\
\n\
  // Perform a deep comparison to check if two objects are equal.\n\
  _.isEqual = function(a, b) {\n\
    return eq(a, b, []);\n\
  };\n\
\n\
  // Is a given array, string, or object empty?\n\
  // An \"empty\" object has no enumerable own-properties.\n\
  _.isEmpty = function(obj) {\n\
    if (obj == null) return true;\n\
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;\n\
    for (var key in obj) if (_.has(obj, key)) return false;\n\
    return true;\n\
  };\n\
\n\
  // Is a given value a DOM element?\n\
  _.isElement = function(obj) {\n\
    return !!(obj && obj.nodeType == 1);\n\
  };\n\
\n\
  // Is a given value an array?\n\
  // Delegates to ECMA5's native Array.isArray\n\
  _.isArray = nativeIsArray || function(obj) {\n\
    return toString.call(obj) == '[object Array]';\n\
  };\n\
\n\
  // Is a given variable an object?\n\
  _.isObject = function(obj) {\n\
    return obj === Object(obj);\n\
  };\n\
\n\
  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.\n\
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {\n\
    _['is' + name] = function(obj) {\n\
      return toString.call(obj) == '[object ' + name + ']';\n\
    };\n\
  });\n\
\n\
  // Define a fallback version of the method in browsers (ahem, IE), where\n\
  // there isn't any inspectable \"Arguments\" type.\n\
  if (!_.isArguments(arguments)) {\n\
    _.isArguments = function(obj) {\n\
      return !!(obj && _.has(obj, 'callee'));\n\
    };\n\
  }\n\
\n\
  // Is a given object a finite number?\n\
  _.isFinite = function(obj) {\n\
    return _.isNumber(obj) && isFinite(obj);\n\
  };\n\
\n\
  // Is the given value `NaN`?\n\
  _.isNaN = function(obj) {\n\
    // `NaN` is the only value for which `===` is not reflexive.\n\
    return obj !== obj;\n\
  };\n\
\n\
  // Is a given value a boolean?\n\
  _.isBoolean = function(obj) {\n\
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';\n\
  };\n\
\n\
  // Is a given value equal to null?\n\
  _.isNull = function(obj) {\n\
    return obj === null;\n\
  };\n\
\n\
  // Is a given variable undefined?\n\
  _.isUndefined = function(obj) {\n\
    return obj === void 0;\n\
  };\n\
\n\
  // Shortcut function for checking if an object has a given property directly\n\
  // on itself (in other words, not on a prototype).\n\
  _.has = function(obj, key) {\n\
    return hasOwnProperty.call(obj, key);\n\
  };\n\
\n\
  // Utility Functions\n\
  // -----------------\n\
\n\
  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its\n\
  // previous owner. Returns a reference to the Underscore object.\n\
  _.noConflict = function() {\n\
    root._ = previousUnderscore;\n\
    return this;\n\
  };\n\
\n\
  // Keep the identity function around for default iterators.\n\
  _.identity = function(value) {\n\
    return value;\n\
  };\n\
\n\
  // Run a function **n** times.\n\
  _.times = function(n, iterator, context) {\n\
    for (var i = 0; i < n; i++) iterator.call(context, i);\n\
  };\n\
\n\
  // List of HTML entities for escaping.\n\
  var htmlEscapes = {\n\
    '&': '&amp;',\n\
    '<': '&lt;',\n\
    '>': '&gt;',\n\
    '\"': '&quot;',\n\
    \"'\": '&#x27;',\n\
    '/': '&#x2F;'\n\
  };\n\
\n\
  // Regex containing the keys listed immediately above.\n\
  var htmlEscaper = /[&<>\"'\\/]/g;\n\
\n\
  // Escape a string for HTML interpolation.\n\
  _.escape = function(string) {\n\
    return ('' + string).replace(htmlEscaper, function(match) {\n\
      return htmlEscapes[match];\n\
    });\n\
  };\n\
\n\
  // If the value of the named property is a function then invoke it;\n\
  // otherwise, return it.\n\
  _.result = function(object, property) {\n\
    if (object == null) return null;\n\
    var value = object[property];\n\
    return _.isFunction(value) ? value.call(object) : value;\n\
  };\n\
\n\
  // Add your own custom functions to the Underscore object, ensuring that\n\
  // they're correctly added to the OOP wrapper as well.\n\
  _.mixin = function(obj) {\n\
    each(_.functions(obj), function(name){\n\
      addToWrapper(name, _[name] = obj[name]);\n\
    });\n\
  };\n\
\n\
  // Generate a unique integer id (unique within the entire client session).\n\
  // Useful for temporary DOM ids.\n\
  var idCounter = 0;\n\
  _.uniqueId = function(prefix) {\n\
    var id = idCounter++;\n\
    return prefix ? prefix + id : id;\n\
  };\n\
\n\
  // By default, Underscore uses ERB-style template delimiters, change the\n\
  // following template settings to use alternative delimiters.\n\
  _.templateSettings = {\n\
    evaluate    : /<%([\\s\\S]+?)%>/g,\n\
    interpolate : /<%=([\\s\\S]+?)%>/g,\n\
    escape      : /<%-([\\s\\S]+?)%>/g\n\
  };\n\
\n\
  // When customizing `templateSettings`, if you don't want to define an\n\
  // interpolation, evaluation or escaping regex, we need one that is\n\
  // guaranteed not to match.\n\
  var noMatch = /.^/;\n\
\n\
  // Certain characters need to be escaped so that they can be put into a\n\
  // string literal.\n\
  var escapes = {\n\
    '\\\\':   '\\\\',\n\
    \"'\":    \"'\",\n\
    r:      '\\r',\n\
    n:      '\\n\
',\n\
    t:      '\\t',\n\
    u2028:  '\\u2028',\n\
    u2029:  '\\u2029'\n\
  };\n\
\n\
  for (var key in escapes) escapes[escapes[key]] = key;\n\
  var escaper = /\\\\|'|\\r|\\n\
|\\t|\\u2028|\\u2029/g;\n\
  var unescaper = /\\\\(\\\\|'|r|n|t|u2028|u2029)/g;\n\
\n\
  // Within an interpolation, evaluation, or escaping, remove HTML escaping\n\
  // that had been previously added.\n\
  var unescape = function(code) {\n\
    return code.replace(unescaper, function(match, escape) {\n\
      return escapes[escape];\n\
    });\n\
  };\n\
\n\
  // JavaScript micro-templating, similar to John Resig's implementation.\n\
  // Underscore templating handles arbitrary delimiters, preserves whitespace,\n\
  // and correctly escapes quotes within interpolated code.\n\
  _.template = function(text, data, settings) {\n\
    settings = _.defaults(settings || {}, _.templateSettings);\n\
\n\
    // Compile the template source, taking care to escape characters that\n\
    // cannot be included in a string literal and then unescape them in code\n\
    // blocks.\n\
    var source = \"__p+='\" + text\n\
      .replace(escaper, function(match) {\n\
        return '\\\\' + escapes[match];\n\
      })\n\
      .replace(settings.escape || noMatch, function(match, code) {\n\
        return \"'+\\n\
((__t=(\" + unescape(code) + \"))==null?'':_.escape(__t))+\\n\
'\";\n\
      })\n\
      .replace(settings.interpolate || noMatch, function(match, code) {\n\
        return \"'+\\n\
((__t=(\" + unescape(code) + \"))==null?'':__t)+\\n\
'\";\n\
      })\n\
      .replace(settings.evaluate || noMatch, function(match, code) {\n\
        return \"';\\n\
\" + unescape(code) + \"\\n\
__p+='\";\n\
      }) + \"';\\n\
\";\n\
\n\
    // If a variable is not specified, place data values in local scope.\n\
    if (!settings.variable) source = 'with(obj||{}){\\n\
' + source + '}\\n\
';\n\
\n\
    source = \"var __t,__p='',__j=Array.prototype.join,\" +\n\
      \"print=function(){__p+=__j.call(arguments,'')};\\n\
\" +\n\
      source + \"return __p;\\n\
\";\n\
\n\
    var render = new Function(settings.variable || 'obj', '_', source);\n\
    if (data) return render(data, _);\n\
    var template = function(data) {\n\
      return render.call(this, data, _);\n\
    };\n\
\n\
    // Provide the compiled function source as a convenience for precompilation.\n\
    template.source = 'function(' + (settings.variable || 'obj') + '){\\n\
' + source + '}';\n\
\n\
    return template;\n\
  };\n\
\n\
  // Add a \"chain\" function, which will delegate to the wrapper.\n\
  _.chain = function(obj) {\n\
    return _(obj).chain();\n\
  };\n\
\n\
  // The OOP Wrapper\n\
  // ---------------\n\
\n\
  // If Underscore is called as a function, it returns a wrapped object that\n\
  // can be used OO-style. This wrapper holds altered versions of all the\n\
  // underscore functions. Wrapped objects may be chained.\n\
  var wrapper = function(obj) { this._wrapped = obj; };\n\
\n\
  // Expose `wrapper.prototype` as `_.prototype`\n\
  _.prototype = wrapper.prototype;\n\
\n\
  // Helper function to continue chaining intermediate results.\n\
  var result = function(obj, chain) {\n\
    return chain ? _(obj).chain() : obj;\n\
  };\n\
\n\
  // A method to easily add functions to the OOP wrapper.\n\
  var addToWrapper = function(name, func) {\n\
    wrapper.prototype[name] = function() {\n\
      var args = slice.call(arguments);\n\
      unshift.call(args, this._wrapped);\n\
      return result(func.apply(_, args), this._chain);\n\
    };\n\
  };\n\
\n\
  // Add all of the Underscore functions to the wrapper object.\n\
  _.mixin(_);\n\
\n\
  // Add all mutator Array functions to the wrapper.\n\
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {\n\
    var method = ArrayProto[name];\n\
    wrapper.prototype[name] = function() {\n\
      var obj = this._wrapped;\n\
      method.apply(obj, arguments);\n\
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];\n\
      return result(obj, this._chain);\n\
    };\n\
  });\n\
\n\
  // Add all accessor Array functions to the wrapper.\n\
  each(['concat', 'join', 'slice'], function(name) {\n\
    var method = ArrayProto[name];\n\
    wrapper.prototype[name] = function() {\n\
      return result(method.apply(this._wrapped, arguments), this._chain);\n\
    };\n\
  });\n\
\n\
  // Start chaining a wrapped Underscore object.\n\
  wrapper.prototype.chain = function() {\n\
    this._chain = true;\n\
    return this;\n\
  };\n\
\n\
  // Extracts the result from a wrapped and chained object.\n\
  wrapper.prototype.value = function() {\n\
    return this._wrapped;\n\
  };\n\
\n\
}).call(this);\n\
//@ sourceURL=component-underscore/index.js"
));
require.register("jungles-panel-core/index.js", Function("exports, require, module",
"module.exports = function (jungles) {\n\
  require('./init')(jungles);\n\
  require('./general')(jungles);\n\
  require('./collections')(jungles);\n\
  require('./header')(jungles);\n\
  require('./alerts')(jungles);\n\
  require('./forms')(jungles);\n\
  require('./types')(jungles);\n\
  require('./instances')(jungles);\n\
  require('./icons')(jungles);\n\
  require('./clipboard')(jungles);\n\
  require('./popups')(jungles);\n\
};\n\
//@ sourceURL=jungles-panel-core/index.js"
));
require.register("jungles-panel-core/init/index.js", Function("exports, require, module",
"require('webfont');\n\
\n\
var init = function (jungles) {\n\
\n\
  jungles.run(function ($http, general, types) {\n\
\n\
    window.WebFont.load({ google: { families: ['Roboto Condensed:300'] } });\n\
    var result = $http.get(general.resource_url('/types'));\n\
\n\
    result.success(function (response) {\n\
      types.set(response);\n\
    });\n\
\n\
  });\n\
\n\
};\n\
\n\
module.exports = init;\n\
//@ sourceURL=jungles-panel-core/init/index.js"
));
require.register("jungles-panel-core/general/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  PageCtrl: function ($scope, $location) {\n\
\n\
    $scope.link = function (url) {\n\
      $location.path(url);\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=jungles-panel-core/general/controllers.js"
));
require.register("jungles-panel-core/general/directives.js", Function("exports, require, module",
"var directives = {\n\
\n\
  confirmClick: function ($document, $parse) {\n\
\n\
    return {\n\
      restrict: 'A',\n\
      link: function ($scope, el, attr) {\n\
\n\
        var fn = $parse(attr.confirmClick);\n\
\n\
        var confirmed = false;\n\
\n\
        el.bind('click', function () {\n\
\n\
          if (confirmed) {\n\
            $scope.$apply(function (event) {\n\
              fn($scope, { $event: event });\n\
            });\n\
          }\n\
\n\
        });\n\
\n\
        $document.on('click', function (e) {\n\
\n\
          $scope.$apply(function () {\n\
\n\
            confirmed = e.target === el[0] || e.target.parentNode === el[0];\n\
            if (!confirmed) {\n\
              return $(el).removeClass('confirm');\n\
            }\n\
\n\
            $(el).addClass('confirm');\n\
\n\
          });\n\
\n\
        });\n\
\n\
      }\n\
\n\
    };\n\
\n\
  },\n\
\n\
  esckeypress: function ($document, $parse) {\n\
\n\
    return {\n\
      restrict: 'A',\n\
      link: function ($scope, el, attr) {\n\
\n\
        var handler = function (e) {\n\
          if (e.which === 27) {\n\
            $scope.$apply(function (event) {\n\
              $parse(attr.esckeypress)($scope, { $event: event });\n\
            });\n\
          }\n\
        };\n\
\n\
        $($document).keydown(handler);\n\
\n\
        $scope.$on('$destroy', function () {\n\
          $($document).unbind('keydown', handler);\n\
        });\n\
\n\
      }\n\
\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = directives;\n\
//@ sourceURL=jungles-panel-core/general/directives.js"
));
require.register("jungles-panel-core/general/factories.js", Function("exports, require, module",
"var getParent = function (path) {\n\
\n\
  path = path.substring(1);\n\
\n\
  var parts = path.split('/');\n\
\n\
  parts.pop();\n\
\n\
  if (parts.length === 0) {\n\
    return '/';\n\
  }\n\
\n\
  return '/' + parts.join('/');\n\
\n\
};\n\
\n\
var factories = function ($document) {\n\
\n\
  var s = {\n\
    resource_url: function (url) {\n\
      return $document[0].getElementById('ResourceUrl').value + url;\n\
    },\n\
\n\
    path: {\n\
      parent: getParent\n\
    }\n\
\n\
  };\n\
\n\
  return s;\n\
\n\
};\n\
\n\
module.exports = factories;\n\
//@ sourceURL=jungles-panel-core/general/factories.js"
));
require.register("jungles-panel-core/general/index.js", Function("exports, require, module",
"var factories = require('./factories');\n\
var directives = require('./directives');\n\
var controllers = require('./controllers');\n\
\n\
var general = function (app) {\n\
  app.directive('confirmClick', directives.confirmClick);\n\
  app.directive('esckeypress', directives.esckeypress);\n\
  app.factory('_', function () { return require('underscore'); });\n\
  app.factory('general', factories);\n\
  app.controller('PageCtrl', controllers.PageCtrl);\n\
};\n\
\n\
module.exports = general;\n\
//@ sourceURL=jungles-panel-core/general/index.js"
));
require.register("jungles-panel-core/collections/index.js", Function("exports, require, module",
"var services = require('./services');\n\
\n\
var collections = function (app) {\n\
  app.factory('collections', services);\n\
};\n\
\n\
module.exports = collections;\n\
//@ sourceURL=jungles-panel-core/collections/index.js"
));
require.register("jungles-panel-core/collections/services.js", Function("exports, require, module",
"var services = function () {\n\
  return {\n\
    instances: [],\n\
    types: [],\n\
    alerts: [],\n\
    clipboard: [],\n\
    popups: [],\n\
    globals: {},\n\
  };\n\
};\n\
\n\
module.exports = services;\n\
//@ sourceURL=jungles-panel-core/collections/services.js"
));
require.register("jungles-panel-core/header/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  HeaderCtrl: function ($scope, header, collections, general) {\n\
\n\
    $scope.globals = collections.globals;\n\
\n\
    $scope.$watch('globals', function () {\n\
\n\
      if (collections.globals.path) {\n\
        $scope.path_navigation = header.pathToNavigation(collections.globals.path);\n\
      }\n\
\n\
    }, true);\n\
\n\
    $scope.back = function () {\n\
      $scope.link(general.path.parent(collections.globals.path));\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=jungles-panel-core/header/controllers.js"
));
require.register("jungles-panel-core/header/factories.js", Function("exports, require, module",
"var factories = function () {\n\
\n\
  return {\n\
\n\
    pathToNavigation: function (path) {\n\
\n\
      var root = { path: '/', name: 'Home' };\n\
\n\
      if (path === '/') {\n\
        return [root];\n\
      }\n\
\n\
      var navigation = [];\n\
\n\
      var i;\n\
      var parts = path.split('/');\n\
      var path_parts = [];\n\
\n\
      parts.forEach(function (current) {\n\
\n\
        if (current === '') {\n\
          navigation.push(root);\n\
        } else {\n\
          path_parts.push(current);\n\
          navigation.push({ name: current, path: '/' + path_parts.join('/') });\n\
        }\n\
\n\
      });\n\
\n\
      return navigation;\n\
\n\
    }\n\
\n\
  };\n\
\n\
};\n\
\n\
module.exports = factories;\n\
//@ sourceURL=jungles-panel-core/header/factories.js"
));
require.register("jungles-panel-core/header/index.js", Function("exports, require, module",
"var factories = require('./factories');\n\
var controllers = require('./controllers');\n\
\n\
var header = function (app) {\n\
  app.factory('header', factories);\n\
  app.controller('HeaderCtrl', controllers.HeaderCtrl);\n\
};\n\
\n\
module.exports = header;\n\
//@ sourceURL=jungles-panel-core/header/index.js"
));
require.register("jungles-panel-core/alerts/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  AlertsCtrl: function ($scope, collections) {\n\
\n\
    /* Format\n\
    * var errors = [\n\
    * { type: 'success/error', name: 'Bold text', msg: 'None bold text', keep: 'boolean' },\n\
    * ];\n\
    */\n\
\n\
    $scope.alerts = collections.alerts;\n\
\n\
    $scope.$on('$locationChangeSuccess', function () {\n\
\n\
      var i;\n\
\n\
      for (i = $scope.alerts.length - 1; i >= 0; i -= 1) {\n\
        \n\
        var current = $scope.alerts[i];\n\
\n\
        if (!current.keep) {\n\
          $scope.alerts.splice(i, 1);\n\
        } else {\n\
          current.keep = false;\n\
        }\n\
\n\
      }\n\
\n\
    });\n\
\n\
    $scope.close = function (alert) {\n\
      collections.alerts.forEach(function (a, i) {\n\
        if (a === alert) {\n\
          collections.alerts.splice(i, 1);\n\
        }\n\
      });\n\
    };\n\
\n\
    // Icon\n\
\n\
    $scope.getIcon = function (alert) {\n\
      if (alert.type === 'success') {\n\
        return 'icon-ok';\n\
      }\n\
\n\
      if (alert.type === 'error') {\n\
        return 'icon-remove';\n\
      }\n\
    };\n\
\n\
    $scope.getStyle = function (alert) {\n\
      if (alert.type === 'success') {\n\
        return { color: '#00B200' };\n\
      }\n\
\n\
      if (alert.type === 'error') {\n\
        return { color: '#E74C3C' };\n\
      }\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=jungles-panel-core/alerts/controllers.js"
));
require.register("jungles-panel-core/alerts/factories.js", Function("exports, require, module",
"var factories = function () {\n\
\n\
  return {\n\
\n\
    flattenValidationErrors: function (errors) {\n\
\n\
      var i;\n\
      var flat = [];\n\
\n\
      for (i in errors) {\n\
\n\
        if (errors.hasOwnProperty(i)) {\n\
\n\
          flat.push({\n\
            type: 'error',\n\
            name: i,\n\
            msg: errors[i].join(', ')\n\
          });\n\
\n\
        }\n\
\n\
      }\n\
\n\
      return flat;\n\
\n\
    }\n\
\n\
  };\n\
\n\
};\n\
\n\
module.exports = factories;\n\
//@ sourceURL=jungles-panel-core/alerts/factories.js"
));
require.register("jungles-panel-core/alerts/index.js", Function("exports, require, module",
"var factories = require('./factories');\n\
var controllers = require('./controllers');\n\
\n\
var alerts = function (app) {\n\
\n\
  app.factory('alerts', factories);\n\
  app.controller('AlertsCtrl', controllers.AlertsCtrl);\n\
\n\
};\n\
\n\
module.exports = alerts;\n\
//@ sourceURL=jungles-panel-core/alerts/index.js"
));
require.register("jungles-panel-core/alerts/specs/factories.js", Function("exports, require, module",
"var factories = require('../factories');\n\
\n\
describe('factories', function () {\n\
\n\
  describe('flattenValidationErrors', function () {\n\
\n\
    it('flattens the validation errors', function () {\n\
\n\
      var errors = {\n\
        name: [ 'Should be unique', 'Is empty' ],\n\
        body: [ 'Is empty' ],\n\
      };\n\
\n\
      factories().flattenValidationErrors(errors).should.eql([\n\
        {\n\
          type: 'error',\n\
          name: 'name',\n\
          msg: 'Should be unique, Is empty'\n\
        },\n\
        {\n\
          type: 'error',\n\
          name: 'body',\n\
          msg: 'Is empty'\n\
        }\n\
      ]);\n\
\n\
    });\n\
\n\
  });\n\
\n\
});\n\
//@ sourceURL=jungles-panel-core/alerts/specs/factories.js"
));
require.register("jungles-panel-core/forms/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  CreateFormCtrl: function ($scope, $routeParams, $window, instances, collections, general, alerts, _) {\n\
\n\
    var max_order = _.max(collections.instances, function (instance) {\n\
      return instance.order;\n\
    });\n\
\n\
    $scope.data = {\n\
      type: $routeParams.type,\n\
      parent: $routeParams.parent,\n\
      order: max_order ? max_order.order + 1 : 1\n\
    };\n\
\n\
    $scope.path = $scope.data.parent;\n\
\n\
    collections.globals.path = $scope.path;\n\
\n\
    // Get Form Url\n\
\n\
    $scope.form_url = general.resource_url('/types/' + $scope.data.type + '/form');\n\
\n\
    // create\n\
\n\
    $scope.submit = instances.create.push;\n\
\n\
    // Cancel\n\
\n\
    $scope.cancel = function () {\n\
      $scope.link($scope.data.parent);\n\
    };\n\
\n\
  },\n\
\n\
  EditFormCtrl: function ($scope, $routeParams, $window, $location, instances, general, collections, alerts, _) {\n\
\n\
    $scope.path = $routeParams.path;\n\
    collections.globals.path = general.path.parent($scope.path);\n\
    \n\
    // Get Form Url\n\
\n\
    $scope.$watch('data.type', function (type) {\n\
      if (typeof type !== 'undefined') {\n\
        $scope.form_url = general.resource_url('/types/' + type + '/form');\n\
      }\n\
    });\n\
\n\
    // Get current instance\n\
\n\
    instances.get({ path: $scope.path }, function (instances) {\n\
\n\
      var current = instances[0];\n\
\n\
      // Data\n\
\n\
      $scope.data = current;\n\
      \n\
    });\n\
\n\
    // create\n\
\n\
    $scope.submit = instances.update.push;\n\
\n\
    // Cancel\n\
\n\
    $scope.cancel = function () {\n\
      $scope.link(general.path.parent($scope.path));\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=jungles-panel-core/forms/controllers.js"
));
require.register("jungles-panel-core/forms/index.js", Function("exports, require, module",
"var controllers = require('./controllers');\n\
\n\
var forms = function (app) {\n\
  app.controller('CreateFormCtrl', controllers.CreateFormCtrl);\n\
  app.controller('EditFormCtrl', controllers.EditFormCtrl);\n\
\n\
  app.config(function ($routeProvider) {\n\
\n\
    $routeProvider.when('/new/:type/*parent', {\n\
      controller: 'CreateFormCtrl',\n\
      templateUrl: 'partials/form.html'\n\
    });\n\
\n\
    $routeProvider.when('/edit/*path', {\n\
      controller: 'EditFormCtrl',\n\
      templateUrl: 'partials/form.html'\n\
    });\n\
\n\
  });\n\
};\n\
\n\
module.exports = forms;\n\
//@ sourceURL=jungles-panel-core/forms/index.js"
));
require.register("jungles-panel-core/types/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  TypesCtrl: function ($scope, collections, types) {\n\
\n\
    $scope.globals = collections.globals;\n\
    $scope.types = collections.types;\n\
\n\
    $scope.$watch('globals', function () {\n\
\n\
      if ($scope.globals.type) {\n\
        collections.types.length = 0;\n\
        collections.types.push.apply(collections.types, types.get($scope.globals.type).children);\n\
      }\n\
\n\
    }, true);\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=jungles-panel-core/types/controllers.js"
));
require.register("jungles-panel-core/types/factories.js", Function("exports, require, module",
"var types = [];\n\
\n\
var factories = function () {\n\
\n\
  return {\n\
\n\
    set: function (data) {\n\
      types.push.apply(types, data);\n\
    },\n\
\n\
    get: function (name) {\n\
      return types.filter(function (type) {\n\
        return type.name === name;\n\
      })[0];\n\
    },\n\
\n\
  };\n\
\n\
};\n\
\n\
module.exports = factories;\n\
//@ sourceURL=jungles-panel-core/types/factories.js"
));
require.register("jungles-panel-core/types/index.js", Function("exports, require, module",
"var controllers = require('./controllers');\n\
var factories = require('./factories');\n\
\n\
var types = function (app) {\n\
  app.factory('types', factories);\n\
  app.controller('TypesCtrl', controllers.TypesCtrl);\n\
};\n\
\n\
module.exports = types;\n\
//@ sourceURL=jungles-panel-core/types/index.js"
));
require.register("jungles-panel-core/instances/controllers.js", Function("exports, require, module",
"var InstancesCtrl = function ($scope, $routeParams, header, instances, collections, general, _) {\n\
\n\
  $scope.path = $routeParams.path || '/';\n\
  $scope.instances = collections.instances;\n\
  collections.globals.path = $scope.path;\n\
\n\
  // Current & Instances\n\
\n\
  var re = new RegExp('^' + instances.escapeForRegex($scope.path) + '(/[^/]+$|$)');\n\
\n\
  if ($scope.path === '/') {\n\
    re = new RegExp('^/[^/]+$');\n\
  }\n\
\n\
  instances.get({ path: re }, function (response) {\n\
\n\
    if ($scope.path === '/') {\n\
      response.splice(0, 0, {\n\
        name: 'root',\n\
        type: 'root',\n\
        path: '/',\n\
      });\n\
    }\n\
\n\
    // 404\n\
\n\
    if (response.length === 0) {\n\
      return;\n\
    }\n\
\n\
    collections.globals.type = response.shift().type;\n\
    collections.instances.length = 0;\n\
    collections.instances.push.apply(collections.instances, response);\n\
\n\
  });\n\
\n\
};\n\
\n\
var InstanceCtrl = function ($scope, instances, collections, _) {\n\
\n\
  $scope.remove = function () {\n\
\n\
    // UI Remove\n\
\n\
    collections.instances.forEach(function (instance, i) {\n\
      if (instance.path === $scope.instance.path) {\n\
        collections.instances.splice(i, 1);\n\
      }\n\
    });\n\
\n\
    // Clipboard Remove\n\
\n\
    collections.clipboard.forEach(function (instance, i) {\n\
      if (instance.path === $scope.instance.path) {\n\
        collections.clipboard.splice(i, 1);\n\
      }\n\
    });\n\
\n\
    // Database Remove\n\
\n\
    instances.remove.push($scope.instance);\n\
\n\
  };\n\
\n\
  // Move\n\
\n\
  $scope.clipboard = function () {\n\
\n\
    var isAlreadyInClipboard = _.chain(collections.clipboard)\n\
      .map(function (instance) { return instance.path; })\n\
      .contains($scope.instance.path)\n\
      .value();\n\
\n\
    if (!isAlreadyInClipboard) {\n\
      collections.clipboard.push(JSON.parse(JSON.stringify($scope.instance)));\n\
    }\n\
  };\n\
\n\
};\n\
\n\
module.exports = { InstanceCtrl: InstanceCtrl, InstancesCtrl: InstancesCtrl };\n\
//@ sourceURL=jungles-panel-core/instances/controllers.js"
));
require.register("jungles-panel-core/instances/factories.js", Function("exports, require, module",
"var oar = require('oar');\n\
var qs = require('querystring');\n\
\n\
var factories = function ($http, $rootScope, $window, $location, general, collections, alerts, _) {\n\
\n\
  var multipleResultMsg = function (results) {\n\
\n\
    var paths = _.map(results, function (instance) { return instance.path; });\n\
\n\
    paths.sort(function (a, b) {\n\
      return a.length - b.length;\n\
    });\n\
\n\
    if (paths.length > 3) {\n\
      return paths.slice(0, 3).join(', ') + ', ...';\n\
    }\n\
\n\
    return paths.join(', ');\n\
\n\
  };\n\
\n\
  var t = {\n\
\n\
    escapeForRegex: function (s) {\n\
      return s.replace(/[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g, \"\\\\$&\");\n\
    },\n\
\n\
    get: function (query, callback) {\n\
      var key;\n\
      for (key in query) {\n\
        if (query.hasOwnProperty(key)) {\n\
          if (query[key] instanceof RegExp) {\n\
            query[key] = 'regex-' + query[key].toString();\n\
          }\n\
        }\n\
      }\n\
\n\
      var result = $http.get(general.resource_url('/instances?' + qs.stringify(query)));\n\
      result.success(function (response) {\n\
        callback(response);\n\
      });\n\
    },\n\
\n\
    remove: oar(),\n\
    create: oar(),\n\
    update: oar(),\n\
    copy: oar(),\n\
\n\
  };\n\
\n\
  t.remove.on('push', function (instances) {\n\
\n\
    $rootScope.$apply(function () {\n\
\n\
      var instance;\n\
\n\
      while (instance = instances.shift()) {\n\
\n\
        var result = $http.delete(general.resource_url('/instances/' + instance.path));\n\
\n\
        result.success(function (response, status, headers, config) {\n\
\n\
          collections.alerts.length = 0;\n\
\n\
          collections.alerts.push({\n\
            type: 'success',\n\
            name: 'Removed',\n\
            msg: multipleResultMsg(response),\n\
          });\n\
\n\
        });\n\
\n\
      }\n\
\n\
      instances.length = 0;\n\
\n\
    });\n\
\n\
  });\n\
\n\
  t.create.on('push', function (instances) {\n\
\n\
    $rootScope.$apply(function () {\n\
\n\
      var instance;\n\
\n\
      while (instance = instances.shift()) {\n\
\n\
        var result = $http.post(general.resource_url('/instances'), instance);\n\
\n\
        result.success(function (response, status, headers, config) {\n\
\n\
          if (response.errors) {\n\
            collections.alerts.length = 0;\n\
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));\n\
            $window.scrollTo(0, 0);\n\
            return;\n\
          }\n\
\n\
          collections.alerts.push({\n\
            type: 'success',\n\
            name: 'Created',\n\
            msg: response[0].path,\n\
            keep: true\n\
          });\n\
\n\
          $location.path(general.path.parent(response[0].path));\n\
\n\
        });\n\
\n\
      }\n\
\n\
      instances.length = 0;\n\
\n\
    });\n\
\n\
  });\n\
\n\
  t.update.on('push', function (instances) {\n\
\n\
    $rootScope.$apply(function () {\n\
\n\
      var instance;\n\
\n\
      while (instance = instances.shift()) {\n\
\n\
        var result = $http.put(general.resource_url('/instances'), instance);\n\
\n\
        result.success(function (instance, response, status, headers, config) {\n\
\n\
          collections.alerts.length = 0;\n\
\n\
          if (response.errors) {\n\
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));\n\
            return;\n\
          }\n\
\n\
          collections.alerts.push({\n\
            type: 'success',\n\
            name: 'Saved',\n\
            msg: response[0].path,\n\
            keep: instance.path !== response[0].path\n\
          });\n\
\n\
          $location.path('/edit/' + response[0].path);\n\
          $window.scrollTo(0, 0);\n\
\n\
        }.bind(null, instance));\n\
\n\
      }\n\
\n\
      instances.length = 0;\n\
\n\
    });\n\
\n\
  });\n\
\n\
  t.copy.on('push', function (instances) {\n\
\n\
    $rootScope.$apply(function () {\n\
\n\
      var instance;\n\
\n\
      while (instance = instances.shift()) {\n\
\n\
        var result = $http.post(general.resource_url('/instances/copy'), instance);\n\
\n\
        result.success(function (response, status, headers, config) {\n\
\n\
          collections.alerts.length = 0;\n\
\n\
          if (response.errors) {\n\
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));\n\
            return;\n\
          }\n\
\n\
          collections.alerts.push({\n\
            type: 'success',\n\
            name: 'Copy',\n\
            msg: multipleResultMsg(response),\n\
          });\n\
\n\
          collections.instances.push(response[0]);\n\
\n\
          collections.instances.sort(function (a, b) {\n\
            return a.sort > b.sort;\n\
          });\n\
\n\
        });\n\
\n\
      }\n\
\n\
    });\n\
\n\
  });\n\
\n\
  return t;\n\
\n\
};\n\
\n\
module.exports = factories;\n\
//@ sourceURL=jungles-panel-core/instances/factories.js"
));
require.register("jungles-panel-core/instances/filters.js", Function("exports, require, module",
"var filters = {\n\
\n\
  selected: function (collections) {\n\
\n\
    return function (input) {\n\
      var current = collections.selected.find(input.path);\n\
\n\
      if (current) {\n\
        return 'selected';\n\
      }\n\
\n\
      return '';\n\
    };\n\
\n\
  },\n\
\n\
\n\
};\n\
\n\
module.exports = filters;\n\
//@ sourceURL=jungles-panel-core/instances/filters.js"
));
require.register("jungles-panel-core/instances/index.js", Function("exports, require, module",
"var controllers = require('./controllers');\n\
var factories = require('./factories');\n\
\n\
var instances = function (app) {\n\
\n\
  app.factory('instances', factories);\n\
  app.controller('InstanceCtrl', controllers.InstanceCtrl);\n\
  app.controller('InstancesCtrl', controllers.InstancesCtrl);\n\
\n\
  app.config(function ($routeProvider, $locationProvider) {\n\
    \n\
    $routeProvider.when('*path', {\n\
      controller: 'InstancesCtrl',\n\
      templateUrl: 'partials/list.html'\n\
    });\n\
\n\
  });\n\
\n\
};\n\
\n\
module.exports = instances;\n\
//@ sourceURL=jungles-panel-core/instances/index.js"
));
require.register("jungles-panel-core/icons/index.js", Function("exports, require, module",
"var icons = function (app) {\n\
\n\
  app.controller('IconCtrl', function ($scope, types, _) {\n\
\n\
    var base = {\n\
      name: 'icon-file-alt',\n\
      color: 'inherit',\n\
    };\n\
\n\
    $scope.getIcon = function (name) {\n\
      var type = _.extend(base, types.get(name).icon);\n\
      return type.name;\n\
    };\n\
\n\
    $scope.getStyle = function (name) {\n\
      var type = _.extend(base, types.get(name).icon);\n\
      return { color: type.color };\n\
    };\n\
\n\
  });\n\
\n\
};\n\
\n\
module.exports = icons;\n\
//@ sourceURL=jungles-panel-core/icons/index.js"
));
require.register("jungles-panel-core/clipboard/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  ClipboardCtrl: function ($scope, collections) {\n\
    $scope.clipboard = collections.clipboard;\n\
  },\n\
\n\
  ClipboardInstanceCtrl: function ($scope, $window, collections, alerts, instances, clipboard, _) {\n\
\n\
    $scope.clear = clipboard.clear;\n\
\n\
    $scope.canCopy = function () {\n\
      return _.contains(collections.types, $scope.instance.type);\n\
    };\n\
\n\
    $scope.canCopyText = function () {\n\
      if ($scope.canCopy()) {\n\
        return 'Copy here';\n\
      }\n\
\n\
      return 'Cannot copy here';\n\
    };\n\
\n\
    $scope.copy = function () {\n\
\n\
      var copy = JSON.parse(JSON.stringify($scope.instance));\n\
      var is_already_in_instances = _.chain(collections.instances)\n\
        .map(function (instance) { return instance.name.toLowerCase(); })\n\
        .contains(copy.name.toLowerCase())\n\
        .value();\n\
        \n\
      copy.parent = collections.globals.path;\n\
      copy.order = _.max(collections.instances, function (instance) {\n\
        return instance.order;\n\
      }).order + 1 || 1;\n\
\n\
      // Name doesn't exist at this level\n\
\n\
      if (!is_already_in_instances) {\n\
        $scope.clear();\n\
        return instances.copy.push(copy);\n\
      }\n\
\n\
      // Pass it to popup\n\
\n\
      return collections.popups.push({ type: 'copy', data: copy });\n\
\n\
    };\n\
\n\
  },\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=jungles-panel-core/clipboard/controllers.js"
));
require.register("jungles-panel-core/clipboard/factories.js", Function("exports, require, module",
"var factories = function (collections) {\n\
\n\
  \n\
  return {\n\
\n\
    clear: function (instance) {\n\
\n\
      collections.clipboard.forEach(function (instance, i) {\n\
        if (collections.clipboard[i].path === instance.path) {\n\
          collections.clipboard.splice(i, 1);\n\
        }\n\
      });\n\
\n\
    }\n\
\n\
  };\n\
\n\
};\n\
\n\
module.exports = factories;\n\
//@ sourceURL=jungles-panel-core/clipboard/factories.js"
));
require.register("jungles-panel-core/clipboard/index.js", Function("exports, require, module",
"var factories = require('./factories');\n\
var controllers = require('./controllers');\n\
\n\
var move = function (app) {\n\
  app.factory('clipboard', factories);\n\
  app.controller('ClipboardCtrl', controllers.ClipboardCtrl);\n\
  app.controller('ClipboardInstanceCtrl', controllers.ClipboardInstanceCtrl);\n\
  app.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);\n\
};\n\
\n\
module.exports = move;\n\
//@ sourceURL=jungles-panel-core/clipboard/index.js"
));
require.register("jungles-panel-core/header/specs/factories.js", Function("exports, require, module",
"var factories = require('../factories');\n\
\n\
describe('factories', function () {\n\
\n\
  it('returns the root navigation', function () {\n\
\n\
    factories().pathToNavigation('/').should.eql([\n\
      { path: '/', name: 'Home' }\n\
    ]);\n\
\n\
  });\n\
\n\
  it('returns the navigation', function () {\n\
\n\
    factories().pathToNavigation('/products/skateboard').should.eql([\n\
      { path: '/', name: 'Home' },\n\
      { path: '/products', name: 'products' },\n\
      { path: '/products/skateboard', name: 'skateboard' },\n\
    ]);\n\
\n\
  });\n\
\n\
});\n\
//@ sourceURL=jungles-panel-core/header/specs/factories.js"
));
require.register("jungles-panel-core/popups/controllers.js", Function("exports, require, module",
"var controllers = {\n\
\n\
  CopyPopupCtrl: function ($scope, collections, instances, clipboard, _) {\n\
\n\
    $scope.popups = collections.popups;\n\
    $scope.show = false;\n\
    $scope.data = { name: '' };\n\
\n\
    $scope.$watch('popups', function () {\n\
      $scope.popups.forEach(function (popup) {\n\
        if (popup.type === 'copy') {\n\
          $scope.show = true;\n\
          $scope.data = popup.data;\n\
        }\n\
      });\n\
    }, true);\n\
\n\
    $scope.validate = function (form_invalid, new_name) {\n\
      var name_already_exists = _.chain(collections.instances)\n\
        .map(function (instance) { return instance.name.toLowerCase(); })\n\
        .contains((new_name || '').toLowerCase())\n\
        .value();\n\
\n\
      return form_invalid || name_already_exists;\n\
    };\n\
\n\
    $scope.rename = function () {\n\
      $scope.data.name = $scope.new_name;\n\
      $scope.new_name = '';\n\
      clipboard.clear($scope.data);\n\
      instances.copy.push($scope.data);\n\
      $scope.close();\n\
    };\n\
\n\
    $scope.close = function () {\n\
      collections.popups.length = 0;\n\
      $scope.show = false;\n\
    };\n\
\n\
  }\n\
\n\
};\n\
\n\
module.exports = controllers;\n\
//@ sourceURL=jungles-panel-core/popups/controllers.js"
));
require.register("jungles-panel-core/popups/index.js", Function("exports, require, module",
"var controllers = require('./controllers');\n\
\n\
var popups = function (jungles) {\n\
  jungles.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);\n\
};\n\
\n\
module.exports = popups;\n\
//@ sourceURL=jungles-panel-core/popups/index.js"
));
require.register("jungles-panel/index.js", Function("exports, require, module",
"var jungles = window.angular.module('jungles', [\n\
  require('angular-markdown-textarea'),\n\
  require('angular-arrangeable-files')\n\
]);\n\
\n\
window.jungles = jungles;\n\
\n\
require('jungles-panel-core')(jungles);\n\
//@ sourceURL=jungles-panel/index.js"
));













require.alias("enome-components-angular-markdown-textarea/index.js", "jungles-panel/deps/angular-markdown-textarea/index.js");
require.alias("enome-components-angular-markdown-textarea/template.js", "jungles-panel/deps/angular-markdown-textarea/template.js");
require.alias("enome-components-angular-markdown-textarea/index.js", "jungles-panel/deps/angular-markdown-textarea/index.js");
require.alias("enome-components-angular-markdown-textarea/index.js", "angular-markdown-textarea/index.js");

require.alias("enome-components-angular-markdown-editor/index.js", "enome-components-angular-markdown-textarea/deps/angular-markdown-editor/index.js");
require.alias("enome-components-angular-markdown-editor/template.js", "enome-components-angular-markdown-textarea/deps/angular-markdown-editor/template.js");
require.alias("enome-components-angular-markdown-editor/src/controllers.js", "enome-components-angular-markdown-textarea/deps/angular-markdown-editor/src/controllers.js");
require.alias("enome-components-angular-markdown-editor/src/directives.js", "enome-components-angular-markdown-textarea/deps/angular-markdown-editor/src/directives.js");
require.alias("enome-components-angular-markdown-editor/src/filters.js", "enome-components-angular-markdown-textarea/deps/angular-markdown-editor/src/filters.js");
require.alias("enome-components-angular-markdown-editor/src/factories.js", "enome-components-angular-markdown-textarea/deps/angular-markdown-editor/src/factories.js");
require.alias("enome-components-angular-markdown-editor/index.js", "enome-components-angular-markdown-textarea/deps/angular-markdown-editor/index.js");
require.alias("component-marked/lib/marked.js", "enome-components-angular-markdown-editor/deps/marked/lib/marked.js");
require.alias("component-marked/lib/marked.js", "enome-components-angular-markdown-editor/deps/marked/index.js");
require.alias("component-marked/lib/marked.js", "component-marked/index.js");

require.alias("enome-components-webfont/index.js", "enome-components-angular-markdown-editor/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-angular-markdown-editor/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-webfont/index.js");
require.alias("enome-components-angular-file-manager/index.js", "enome-components-angular-markdown-editor/deps/angular-file-manager/index.js");
require.alias("enome-components-angular-file-manager/js/breadcrumbs.js", "enome-components-angular-markdown-editor/deps/angular-file-manager/js/breadcrumbs.js");
require.alias("enome-components-angular-file-manager/js/extra-events.js", "enome-components-angular-markdown-editor/deps/angular-file-manager/js/extra-events.js");
require.alias("enome-components-angular-file-manager/js/directories.js", "enome-components-angular-markdown-editor/deps/angular-file-manager/js/directories.js");
require.alias("enome-components-angular-file-manager/js/files.js", "enome-components-angular-markdown-editor/deps/angular-file-manager/js/files.js");
require.alias("enome-components-angular-file-manager/template.js", "enome-components-angular-markdown-editor/deps/angular-file-manager/template.js");
require.alias("enome-components-angular-file-manager/index.js", "enome-components-angular-markdown-editor/deps/angular-file-manager/index.js");


require.alias("enome-components-webfont/index.js", "enome-components-angular-file-manager/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-angular-file-manager/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-webfont/index.js");
require.alias("component-upload/index.js", "enome-components-angular-file-manager/deps/upload/index.js");
require.alias("component-emitter/index.js", "component-upload/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-normalized-upload/index.js", "enome-components-angular-file-manager/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "enome-components-angular-file-manager/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "component-normalized-upload/index.js");
require.alias("enome-components-angular-enter-directive/index.js", "enome-components-angular-file-manager/deps/angular-enter-directive/index.js");
require.alias("enome-components-angular-enter-directive/index.js", "enome-components-angular-file-manager/deps/angular-enter-directive/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-enter-directive/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-enter-directive/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-safe-apply/index.js");
require.alias("enome-components-angular-enter-directive/index.js", "enome-components-angular-enter-directive/index.js");
require.alias("enome-components-angular-droparea/index.js", "enome-components-angular-file-manager/deps/angular-droparea/index.js");
require.alias("component-normalized-upload/index.js", "enome-components-angular-droparea/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "enome-components-angular-droparea/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "component-normalized-upload/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-file-manager/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-file-manager/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-safe-apply/index.js");
require.alias("enome-components-angular-file-manager/index.js", "enome-components-angular-file-manager/index.js");
require.alias("enome-components-angular-markdown-editor/index.js", "enome-components-angular-markdown-editor/index.js");
require.alias("enome-components-angular-markdown-textarea/index.js", "enome-components-angular-markdown-textarea/index.js");
require.alias("enome-components-angular-arrangeable-files/index.js", "jungles-panel/deps/angular-arrangeable-files/index.js");
require.alias("enome-components-angular-arrangeable-files/template.js", "jungles-panel/deps/angular-arrangeable-files/template.js");
require.alias("enome-components-angular-arrangeable-files/index.js", "jungles-panel/deps/angular-arrangeable-files/index.js");
require.alias("enome-components-angular-arrangeable-files/index.js", "angular-arrangeable-files/index.js");
require.alias("enome-components-angular-arrangeable-array/index.js", "enome-components-angular-arrangeable-files/deps/angular-arrangeable-array/index.js");
require.alias("enome-components-angular-arrangeable-array/template.js", "enome-components-angular-arrangeable-files/deps/angular-arrangeable-array/template.js");
require.alias("enome-components-angular-arrangeable-array/index.js", "enome-components-angular-arrangeable-files/deps/angular-arrangeable-array/index.js");

require.alias("enome-components-webfont/index.js", "enome-components-angular-arrangeable-array/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-angular-arrangeable-array/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-webfont/index.js");
require.alias("enome-components-angular-arrangeable-array/index.js", "enome-components-angular-arrangeable-array/index.js");
require.alias("enome-components-angular-file-manager/index.js", "enome-components-angular-arrangeable-files/deps/angular-file-manager/index.js");
require.alias("enome-components-angular-file-manager/js/breadcrumbs.js", "enome-components-angular-arrangeable-files/deps/angular-file-manager/js/breadcrumbs.js");
require.alias("enome-components-angular-file-manager/js/extra-events.js", "enome-components-angular-arrangeable-files/deps/angular-file-manager/js/extra-events.js");
require.alias("enome-components-angular-file-manager/js/directories.js", "enome-components-angular-arrangeable-files/deps/angular-file-manager/js/directories.js");
require.alias("enome-components-angular-file-manager/js/files.js", "enome-components-angular-arrangeable-files/deps/angular-file-manager/js/files.js");
require.alias("enome-components-angular-file-manager/template.js", "enome-components-angular-arrangeable-files/deps/angular-file-manager/template.js");
require.alias("enome-components-angular-file-manager/index.js", "enome-components-angular-arrangeable-files/deps/angular-file-manager/index.js");


require.alias("enome-components-webfont/index.js", "enome-components-angular-file-manager/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-angular-file-manager/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-webfont/index.js");
require.alias("component-upload/index.js", "enome-components-angular-file-manager/deps/upload/index.js");
require.alias("component-emitter/index.js", "component-upload/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-normalized-upload/index.js", "enome-components-angular-file-manager/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "enome-components-angular-file-manager/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "component-normalized-upload/index.js");
require.alias("enome-components-angular-enter-directive/index.js", "enome-components-angular-file-manager/deps/angular-enter-directive/index.js");
require.alias("enome-components-angular-enter-directive/index.js", "enome-components-angular-file-manager/deps/angular-enter-directive/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-enter-directive/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-enter-directive/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-safe-apply/index.js");
require.alias("enome-components-angular-enter-directive/index.js", "enome-components-angular-enter-directive/index.js");
require.alias("enome-components-angular-droparea/index.js", "enome-components-angular-file-manager/deps/angular-droparea/index.js");
require.alias("component-normalized-upload/index.js", "enome-components-angular-droparea/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "enome-components-angular-droparea/deps/normalized-upload/index.js");
require.alias("component-normalized-upload/index.js", "component-normalized-upload/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-file-manager/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-file-manager/deps/angular-safe-apply/index.js");
require.alias("enome-components-angular-safe-apply/index.js", "enome-components-angular-safe-apply/index.js");
require.alias("enome-components-angular-file-manager/index.js", "enome-components-angular-file-manager/index.js");
require.alias("enome-components-angular-arrangeable-files/index.js", "enome-components-angular-arrangeable-files/index.js");

require.alias("jungles-panel-core/index.js", "jungles-panel/deps/jungles-panel-core/index.js");
require.alias("jungles-panel-core/init/index.js", "jungles-panel/deps/jungles-panel-core/init/index.js");
require.alias("jungles-panel-core/general/controllers.js", "jungles-panel/deps/jungles-panel-core/general/controllers.js");
require.alias("jungles-panel-core/general/directives.js", "jungles-panel/deps/jungles-panel-core/general/directives.js");
require.alias("jungles-panel-core/general/factories.js", "jungles-panel/deps/jungles-panel-core/general/factories.js");
require.alias("jungles-panel-core/general/index.js", "jungles-panel/deps/jungles-panel-core/general/index.js");
require.alias("jungles-panel-core/collections/index.js", "jungles-panel/deps/jungles-panel-core/collections/index.js");
require.alias("jungles-panel-core/collections/services.js", "jungles-panel/deps/jungles-panel-core/collections/services.js");
require.alias("jungles-panel-core/header/controllers.js", "jungles-panel/deps/jungles-panel-core/header/controllers.js");
require.alias("jungles-panel-core/header/factories.js", "jungles-panel/deps/jungles-panel-core/header/factories.js");
require.alias("jungles-panel-core/header/index.js", "jungles-panel/deps/jungles-panel-core/header/index.js");
require.alias("jungles-panel-core/alerts/controllers.js", "jungles-panel/deps/jungles-panel-core/alerts/controllers.js");
require.alias("jungles-panel-core/alerts/factories.js", "jungles-panel/deps/jungles-panel-core/alerts/factories.js");
require.alias("jungles-panel-core/alerts/index.js", "jungles-panel/deps/jungles-panel-core/alerts/index.js");
require.alias("jungles-panel-core/alerts/specs/factories.js", "jungles-panel/deps/jungles-panel-core/alerts/specs/factories.js");
require.alias("jungles-panel-core/forms/controllers.js", "jungles-panel/deps/jungles-panel-core/forms/controllers.js");
require.alias("jungles-panel-core/forms/index.js", "jungles-panel/deps/jungles-panel-core/forms/index.js");
require.alias("jungles-panel-core/types/controllers.js", "jungles-panel/deps/jungles-panel-core/types/controllers.js");
require.alias("jungles-panel-core/types/factories.js", "jungles-panel/deps/jungles-panel-core/types/factories.js");
require.alias("jungles-panel-core/types/index.js", "jungles-panel/deps/jungles-panel-core/types/index.js");
require.alias("jungles-panel-core/instances/controllers.js", "jungles-panel/deps/jungles-panel-core/instances/controllers.js");
require.alias("jungles-panel-core/instances/factories.js", "jungles-panel/deps/jungles-panel-core/instances/factories.js");
require.alias("jungles-panel-core/instances/filters.js", "jungles-panel/deps/jungles-panel-core/instances/filters.js");
require.alias("jungles-panel-core/instances/index.js", "jungles-panel/deps/jungles-panel-core/instances/index.js");
require.alias("jungles-panel-core/icons/index.js", "jungles-panel/deps/jungles-panel-core/icons/index.js");
require.alias("jungles-panel-core/clipboard/controllers.js", "jungles-panel/deps/jungles-panel-core/clipboard/controllers.js");
require.alias("jungles-panel-core/clipboard/factories.js", "jungles-panel/deps/jungles-panel-core/clipboard/factories.js");
require.alias("jungles-panel-core/clipboard/index.js", "jungles-panel/deps/jungles-panel-core/clipboard/index.js");
require.alias("jungles-panel-core/header/specs/factories.js", "jungles-panel/deps/jungles-panel-core/header/specs/factories.js");
require.alias("jungles-panel-core/popups/controllers.js", "jungles-panel/deps/jungles-panel-core/popups/controllers.js");
require.alias("jungles-panel-core/popups/index.js", "jungles-panel/deps/jungles-panel-core/popups/index.js");
require.alias("jungles-panel-core/index.js", "jungles-panel/deps/jungles-panel-core/index.js");
require.alias("jungles-panel-core/index.js", "jungles-panel-core/index.js");
require.alias("enome-oar/index.js", "jungles-panel-core/deps/oar/index.js");
require.alias("enome-oar/index.js", "jungles-panel-core/deps/oar/index.js");
require.alias("enome-oar/index.js", "enome-oar/index.js");
require.alias("component-querystring/index.js", "jungles-panel-core/deps/querystring/index.js");
require.alias("component-trim/index.js", "component-querystring/deps/trim/index.js");

require.alias("component-underscore/index.js", "jungles-panel-core/deps/underscore/index.js");


require.alias("enome-components-webfont/index.js", "jungles-panel-core/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "jungles-panel-core/deps/webfont/index.js");
require.alias("enome-components-webfont/index.js", "enome-components-webfont/index.js");
require.alias("jungles-panel-core/index.js", "jungles-panel-core/index.js");
require.alias("jungles-panel/index.js", "jungles-panel/index.js");