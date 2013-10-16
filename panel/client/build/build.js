
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

require.register("component-marked/lib/marked.js", function(exports, require, module){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i+1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item[item.length-1] === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1][cap[1].length-1] === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1][6] === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0][0];
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<strong>'
        + this.output(cap[2] || cap[1])
        + '</strong>';
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<em>'
        + this.output(cap[2] || cap[1])
        + '</em>';
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<code>'
        + escape(cap[2], true)
        + '</code>';
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<br>';
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<del>'
        + this.output(cap[1])
        + '</del>';
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  if (cap[0][0] !== '!') {
    return '<a href="'
      + escape(link.href)
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>'
      + this.output(cap[1])
      + '</a>';
  } else {
    return '<img src="'
      + escape(link.href)
      + '" alt="'
      + escape(cap[1])
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>';
  }
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    .replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018")       // opening singles
    .replace(/'/g, "\u2019")                            // closing singles & apostrophes
    .replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201C") // opening doubles
    .replace(/"/g, "\u201D")                            // closing doubles
    .replace(/--/g, "\u2014")                           // em-dashes
    .replace(/\.{3}/g, '\u2026');                       // ellipsis
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length-1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return '<hr>\n';
    }
    case 'heading': {
      return '<h'
        + this.token.depth
        + '>'
        + this.inline.output(this.token.text)
        + '</h'
        + this.token.depth
        + '>\n';
    }
    case 'code': {
      if (this.options.highlight) {
        var code = this.options.highlight(this.token.text, this.token.lang);
        if (code != null && code !== this.token.text) {
          this.token.escaped = true;
          this.token.text = code;
        }
      }

      if (!this.token.escaped) {
        this.token.text = escape(this.token.text, true);
      }

      return '<pre><code'
        + (this.token.lang
        ? ' class="'
        + this.options.langPrefix
        + this.token.lang
        + '"'
        : '')
        + '>'
        + this.token.text
        + '</code></pre>\n';
    }
    case 'table': {
      var body = ''
        , heading
        , i
        , row
        , cell
        , j;

      // header
      body += '<thead>\n<tr>\n';
      for (i = 0; i < this.token.header.length; i++) {
        heading = this.inline.output(this.token.header[i]);
        body += this.token.align[i]
          ? '<th align="' + this.token.align[i] + '">' + heading + '</th>\n'
          : '<th>' + heading + '</th>\n';
      }
      body += '</tr>\n</thead>\n';

      // body
      body += '<tbody>\n'
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];
        body += '<tr>\n';
        for (j = 0; j < row.length; j++) {
          cell = this.inline.output(row[j]);
          body += this.token.align[j]
            ? '<td align="' + this.token.align[j] + '">' + cell + '</td>\n'
            : '<td>' + cell + '</td>\n';
        }
        body += '</tr>\n';
      }
      body += '</tbody>\n';

      return '<table>\n'
        + body
        + '</table>\n';
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return '<blockquote>\n'
        + body
        + '</blockquote>\n';
    }
    case 'list_start': {
      var type = this.token.ordered ? 'ol' : 'ul'
        , body = '';

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return '<'
        + type
        + '>\n'
        + body
        + '</'
        + type
        + '>\n';
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'html': {
      return !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
    }
    case 'paragraph': {
      return '<p>'
        + this.inline.output(this.token.text)
        + '</p>\n';
    }
    case 'text': {
      return '<p>'
        + this.parseText()
        + '</p>\n';
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    if (opt) opt = merge({}, marked.defaults, opt);

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(hi) {
      var out, err;

      if (hi !== true) {
        delete opt.highlight;
      }

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done(true);
    }

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

});
require.register("enome-components-webfont/index.js", function(exports, require, module){
/*
 * Copyright 2013 Small Batch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
;(function(window,document,undefined){
var j=void 0,k=!0,l=null,p=!1;function q(a){return function(){return this[a]}}var aa=this;function ba(a,b){var c=a.split("."),d=aa;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&b!==j?d[e]=b:d=d[e]?d[e]:d[e]={}}aa.Ba=k;function ca(a,b,c){return a.call.apply(a.bind,arguments)}
function da(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function s(a,b,c){s=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ca:da;return s.apply(l,arguments)}var ea=Date.now||function(){return+new Date};function fa(a,b){this.G=a;this.u=b||a;this.z=this.u.document;this.R=j}fa.prototype.createElement=function(a,b,c){a=this.z.createElement(a);if(b)for(var d in b)if(b.hasOwnProperty(d))if("style"==d){var e=a,f=b[d];ga(this)?e.setAttribute("style",f):e.style.cssText=f}else a.setAttribute(d,b[d]);c&&a.appendChild(this.z.createTextNode(c));return a};function t(a,b,c){a=a.z.getElementsByTagName(b)[0];a||(a=document.documentElement);a&&a.lastChild&&a.insertBefore(c,a.lastChild)}
function u(a,b){return a.createElement("link",{rel:"stylesheet",href:b})}function ha(a,b){return a.createElement("script",{src:b})}function v(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return;c.push(b);a.className=c.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function w(a,b){for(var c=a.className.split(/\s+/),d=[],e=0,f=c.length;e<f;e++)c[e]!=b&&d.push(c[e]);a.className=d.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}
function ia(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return k;return p}function ga(a){if(a.R===j){var b=a.z.createElement("p");b.innerHTML='<a style="top:1px;">w</a>';a.R=/top/.test(b.getElementsByTagName("a")[0].getAttribute("style"))}return a.R}function x(a){var b=a.u.location.protocol;"about:"==b&&(b=a.G.location.protocol);return"https:"==b?"https:":"http:"};function y(a,b,c){this.w=a;this.T=b;this.Aa=c}ba("webfont.BrowserInfo",y);y.prototype.qa=q("w");y.prototype.hasWebFontSupport=y.prototype.qa;y.prototype.ra=q("T");y.prototype.hasWebKitFallbackBug=y.prototype.ra;y.prototype.sa=q("Aa");y.prototype.hasWebKitMetricsBug=y.prototype.sa;function z(a,b,c,d){this.e=a!=l?a:l;this.o=b!=l?b:l;this.ba=c!=l?c:l;this.f=d!=l?d:l}var ja=/^([0-9]+)(?:[\._-]([0-9]+))?(?:[\._-]([0-9]+))?(?:[\._+-]?(.*))?$/;z.prototype.toString=function(){return[this.e,this.o||"",this.ba||"",this.f||""].join("")};
function A(a){a=ja.exec(a);var b=l,c=l,d=l,e=l;a&&(a[1]!==l&&a[1]&&(b=parseInt(a[1],10)),a[2]!==l&&a[2]&&(c=parseInt(a[2],10)),a[3]!==l&&a[3]&&(d=parseInt(a[3],10)),a[4]!==l&&a[4]&&(e=/^[0-9]+$/.test(a[4])?parseInt(a[4],10):a[4]));return new z(b,c,d,e)};function B(a,b,c,d,e,f,g,h,n,m,r){this.J=a;this.Ha=b;this.za=c;this.ga=d;this.Fa=e;this.fa=f;this.xa=g;this.Ga=h;this.wa=n;this.ea=m;this.k=r}ba("webfont.UserAgent",B);B.prototype.getName=q("J");B.prototype.getName=B.prototype.getName;B.prototype.pa=q("za");B.prototype.getVersion=B.prototype.pa;B.prototype.la=q("ga");B.prototype.getEngine=B.prototype.la;B.prototype.ma=q("fa");B.prototype.getEngineVersion=B.prototype.ma;B.prototype.na=q("xa");B.prototype.getPlatform=B.prototype.na;B.prototype.oa=q("wa");
B.prototype.getPlatformVersion=B.prototype.oa;B.prototype.ka=q("ea");B.prototype.getDocumentMode=B.prototype.ka;B.prototype.ja=q("k");B.prototype.getBrowserInfo=B.prototype.ja;function C(a,b){this.a=a;this.H=b}var ka=new B("Unknown",new z,"Unknown","Unknown",new z,"Unknown","Unknown",new z,"Unknown",j,new y(p,p,p));
C.prototype.parse=function(){var a;if(-1!=this.a.indexOf("MSIE")){a=D(this);var b=E(this),c=A(b),d=F(this.a,/MSIE ([\d\w\.]+)/,1),e=A(d);a=new B("MSIE",e,d,"MSIE",e,d,a,c,b,G(this.H),new y("Windows"==a&&6<=e.e||"Windows Phone"==a&&8<=c.e,p,p))}else if(-1!=this.a.indexOf("Opera"))a:{a="Unknown";var b=F(this.a,/Presto\/([\d\w\.]+)/,1),c=A(b),d=E(this),e=A(d),f=G(this.H);c.e!==l?a="Presto":(-1!=this.a.indexOf("Gecko")&&(a="Gecko"),b=F(this.a,/rv:([^\)]+)/,1),c=A(b));if(-1!=this.a.indexOf("Opera Mini/")){var g=
F(this.a,/Opera Mini\/([\d\.]+)/,1),h=A(g);a=new B("OperaMini",h,g,a,c,b,D(this),e,d,f,new y(p,p,p))}else{if(-1!=this.a.indexOf("Version/")&&(g=F(this.a,/Version\/([\d\.]+)/,1),h=A(g),h.e!==l)){a=new B("Opera",h,g,a,c,b,D(this),e,d,f,new y(10<=h.e,p,p));break a}g=F(this.a,/Opera[\/ ]([\d\.]+)/,1);h=A(g);a=h.e!==l?new B("Opera",h,g,a,c,b,D(this),e,d,f,new y(10<=h.e,p,p)):new B("Opera",new z,"Unknown",a,c,b,D(this),e,d,f,new y(p,p,p))}}else if(/AppleWeb(K|k)it/.test(this.a)){a=D(this);var b=E(this),
c=A(b),d=F(this.a,/AppleWeb(?:K|k)it\/([\d\.\+]+)/,1),e=A(d),f="Unknown",g=new z,h="Unknown",n=p;-1!=this.a.indexOf("Chrome")||-1!=this.a.indexOf("CrMo")||-1!=this.a.indexOf("CriOS")?f="Chrome":/Silk\/\d/.test(this.a)?f="Silk":"BlackBerry"==a||"Android"==a?f="BuiltinBrowser":-1!=this.a.indexOf("Safari")?f="Safari":-1!=this.a.indexOf("AdobeAIR")&&(f="AdobeAIR");"BuiltinBrowser"==f?h="Unknown":"Silk"==f?h=F(this.a,/Silk\/([\d\._]+)/,1):"Chrome"==f?h=F(this.a,/(Chrome|CrMo|CriOS)\/([\d\.]+)/,2):-1!=
this.a.indexOf("Version/")?h=F(this.a,/Version\/([\d\.\w]+)/,1):"AdobeAIR"==f&&(h=F(this.a,/AdobeAIR\/([\d\.]+)/,1));g=A(h);n="AdobeAIR"==f?2<g.e||2==g.e&&5<=g.o:"BlackBerry"==a?10<=c.e:"Android"==a?2<c.e||2==c.e&&1<c.o:526<=e.e||525<=e.e&&13<=e.o;a=new B(f,g,h,"AppleWebKit",e,d,a,c,b,G(this.H),new y(n,536>e.e||536==e.e&&11>e.o,"iPhone"==a||"iPad"==a||"iPod"==a||"Macintosh"==a))}else-1!=this.a.indexOf("Gecko")?(a="Unknown",b=new z,c="Unknown",d=E(this),e=A(d),f=p,-1!=this.a.indexOf("Firefox")?(a=
"Firefox",c=F(this.a,/Firefox\/([\d\w\.]+)/,1),b=A(c),f=3<=b.e&&5<=b.o):-1!=this.a.indexOf("Mozilla")&&(a="Mozilla"),g=F(this.a,/rv:([^\)]+)/,1),h=A(g),f||(f=1<h.e||1==h.e&&9<h.o||1==h.e&&9==h.o&&2<=h.ba||g.match(/1\.9\.1b[123]/)!=l||g.match(/1\.9\.1\.[\d\.]+/)!=l),a=new B(a,b,c,"Gecko",h,g,D(this),e,d,G(this.H),new y(f,p,p))):a=ka;return a};
function D(a){var b=F(a.a,/(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/,1);if(""!=b)return/BB\d{2}/.test(b)&&(b="BlackBerry"),b;a=F(a.a,/(Linux|Mac_PowerPC|Macintosh|Windows|CrOS)/,1);return""!=a?("Mac_PowerPC"==a&&(a="Macintosh"),a):"Unknown"}
function E(a){var b=F(a.a,/(OS X|Windows NT|Android) ([^;)]+)/,2);if(b||(b=F(a.a,/Windows Phone( OS)? ([^;)]+)/,2))||(b=F(a.a,/(iPhone )?OS ([\d_]+)/,2)))return b;if(b=F(a.a,/(?:Linux|CrOS) ([^;)]+)/,1))for(var b=b.split(/\s/),c=0;c<b.length;c+=1)if(/^[\d\._]+$/.test(b[c]))return b[c];return(a=F(a.a,/(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/,2))?a:"Unknown"}function F(a,b,c){return(a=a.match(b))&&a[c]?a[c]:""}function G(a){if(a.documentMode)return a.documentMode};function la(a){this.va=a||"-"}la.prototype.f=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.va)};function H(a,b){this.J=a;this.U=4;this.K="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.K=c[1],this.U=parseInt(c[2],10))}H.prototype.getName=q("J");function I(a){return a.K+a.U}function ma(a){var b=4,c="n",d=l;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function na(a,b,c){this.c=a;this.h=b;this.M=c;this.j="wf";this.g=new la("-")}function pa(a){v(a.h,a.g.f(a.j,"loading"));J(a,"loading")}function K(a){w(a.h,a.g.f(a.j,"loading"));ia(a.h,a.g.f(a.j,"active"))||v(a.h,a.g.f(a.j,"inactive"));J(a,"inactive")}function J(a,b,c){if(a.M[b])if(c)a.M[b](c.getName(),I(c));else a.M[b]()};function L(a,b){this.c=a;this.C=b;this.s=this.c.createElement("span",{"aria-hidden":"true"},this.C)}
function M(a,b){var c=a.s,d;d=[];for(var e=b.J.split(/,\s*/),f=0;f<e.length;f++){var g=e[f].replace(/['"]/g,"");-1==g.indexOf(" ")?d.push(g):d.push("'"+g+"'")}d=d.join(",");e="normal";f=b.U+"00";"o"===b.K?e="oblique":"i"===b.K&&(e="italic");d="position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+d+";"+("font-style:"+e+";font-weight:"+f+";");ga(a.c)?c.setAttribute("style",d):c.style.cssText=
d}function N(a){t(a.c,"body",a.s)}L.prototype.remove=function(){var a=this.s;a.parentNode&&a.parentNode.removeChild(a)};function qa(a,b,c,d,e,f,g,h){this.V=a;this.ta=b;this.c=c;this.q=d;this.C=h||"BESbswy";this.k=e;this.F={};this.S=f||5E3;this.Z=g||l;this.B=this.A=l;a=new L(this.c,this.C);N(a);for(var n in O)O.hasOwnProperty(n)&&(M(a,new H(O[n],I(this.q))),this.F[O[n]]=a.s.offsetWidth);a.remove()}var O={Ea:"serif",Da:"sans-serif",Ca:"monospace"};
qa.prototype.start=function(){this.A=new L(this.c,this.C);N(this.A);this.B=new L(this.c,this.C);N(this.B);this.ya=ea();M(this.A,new H(this.q.getName()+",serif",I(this.q)));M(this.B,new H(this.q.getName()+",sans-serif",I(this.q)));ra(this)};function sa(a,b,c){for(var d in O)if(O.hasOwnProperty(d)&&b===a.F[O[d]]&&c===a.F[O[d]])return k;return p}
function ra(a){var b=a.A.s.offsetWidth,c=a.B.s.offsetWidth;b===a.F.serif&&c===a.F["sans-serif"]||a.k.T&&sa(a,b,c)?ea()-a.ya>=a.S?a.k.T&&sa(a,b,c)&&(a.Z===l||a.Z.hasOwnProperty(a.q.getName()))?P(a,a.V):P(a,a.ta):setTimeout(s(function(){ra(this)},a),25):P(a,a.V)}function P(a,b){a.A.remove();a.B.remove();b(a.q)};function R(a,b,c,d){this.c=b;this.t=c;this.N=0;this.ca=this.Y=p;this.S=d;this.k=a.k}function ta(a,b,c,d,e){if(0===b.length&&e)K(a.t);else{a.N+=b.length;e&&(a.Y=e);for(e=0;e<b.length;e++){var f=b[e],g=c[f.getName()],h=a.t,n=f;v(h.h,h.g.f(h.j,n.getName(),I(n).toString(),"loading"));J(h,"fontloading",n);(new qa(s(a.ha,a),s(a.ia,a),a.c,f,a.k,a.S,d,g)).start()}}}
R.prototype.ha=function(a){var b=this.t;w(b.h,b.g.f(b.j,a.getName(),I(a).toString(),"loading"));w(b.h,b.g.f(b.j,a.getName(),I(a).toString(),"inactive"));v(b.h,b.g.f(b.j,a.getName(),I(a).toString(),"active"));J(b,"fontactive",a);this.ca=k;ua(this)};R.prototype.ia=function(a){var b=this.t;w(b.h,b.g.f(b.j,a.getName(),I(a).toString(),"loading"));ia(b.h,b.g.f(b.j,a.getName(),I(a).toString(),"active"))||v(b.h,b.g.f(b.j,a.getName(),I(a).toString(),"inactive"));J(b,"fontinactive",a);ua(this)};
function ua(a){0==--a.N&&a.Y&&(a.ca?(a=a.t,w(a.h,a.g.f(a.j,"loading")),w(a.h,a.g.f(a.j,"inactive")),v(a.h,a.g.f(a.j,"active")),J(a,"active")):K(a.t))};function S(a,b,c){this.G=a;this.W=b;this.a=c;this.O=this.P=0}function T(a,b){U.W.$[a]=b}S.prototype.load=function(a){var b=a.context||this.G;this.c=new fa(this.G,b);b=new na(this.c,b.document.documentElement,a);if(this.a.k.w){var c=this.W,d=this.c,e=[],f;for(f in a)if(a.hasOwnProperty(f)){var g=c.$[f];g&&e.push(g(a[f],d))}a=a.timeout;this.O=this.P=e.length;a=new R(this.a,this.c,b,a);f=0;for(c=e.length;f<c;f++)d=e[f],d.v(this.a,s(this.ua,this,d,b,a))}else K(b)};
S.prototype.ua=function(a,b,c,d){var e=this;d?a.load(function(a,d,h){var n=0==--e.P;n&&pa(b);setTimeout(function(){ta(c,a,d||{},h||l,n)},0)}):(a=0==--this.P,this.O--,a&&(0==this.O?K(b):pa(b)),ta(c,[],{},l,a))};var va=window,wa=(new C(navigator.userAgent,document)).parse(),U=va.WebFont=new S(window,new function(){this.$={}},wa);U.load=U.load;function V(a,b){this.c=a;this.d=b}V.prototype.load=function(a){var b,c,d=this.d.urls||[],e=this.d.families||[];b=0;for(c=d.length;b<c;b++)t(this.c,"head",u(this.c,d[b]));d=[];b=0;for(c=e.length;b<c;b++){var f=e[b].split(":");if(f[1])for(var g=f[1].split(","),h=0;h<g.length;h+=1)d.push(new H(f[0],g[h]));else d.push(new H(f[0]))}a(d)};V.prototype.v=function(a,b){return b(a.k.w)};T("custom",function(a,b){return new V(b,a)});function W(a,b){this.c=a;this.d=b}var xa={regular:"n4",bold:"n7",italic:"i4",bolditalic:"i7",r:"n4",b:"n7",i:"i4",bi:"i7"};W.prototype.v=function(a,b){return b(a.k.w)};W.prototype.load=function(a){t(this.c,"head",u(this.c,x(this.c)+"//webfonts.fontslive.com/css/"+this.d.key+".css"));for(var b=this.d.families,c=[],d=0,e=b.length;d<e;d++)c.push.apply(c,ya(b[d]));a(c)};
function ya(a){var b=a.split(":");a=b[0];if(b[1]){for(var c=b[1].split(","),b=[],d=0,e=c.length;d<e;d++){var f=c[d];if(f){var g=xa[f];b.push(g?g:f)}}c=[];for(d=0;d<b.length;d+=1)c.push(new H(a,b[d]));return c}return[new H(a)]}T("ascender",function(a,b){return new W(b,a)});function X(a,b,c){this.a=a;this.c=b;this.d=c;this.m=[]}
X.prototype.v=function(a,b){var c=this,d=c.d.projectId,e=c.d.version;if(d){var f=c.c.u,g=c.c.createElement("script");g.id="__MonotypeAPIScript__"+d;var h=p;g.onload=g.onreadystatechange=function(){if(!h&&(!this.readyState||"loaded"===this.readyState||"complete"===this.readyState)){h=k;if(f["__mti_fntLst"+d]){var e=f["__mti_fntLst"+d]();if(e)for(var m=0;m<e.length;m++)c.m.push(new H(e[m].fontfamily))}b(a.k.w);g.onload=g.onreadystatechange=l}};g.src=c.D(d,e);t(this.c,"head",g)}else b(k)};
X.prototype.D=function(a,b){var c=x(this.c),d=(this.d.api||"fast.fonts.com/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return c+"//"+d+"/"+a+".js"+(b?"?v="+b:"")};X.prototype.load=function(a){a(this.m)};T("monotype",function(a,b){var c=(new C(navigator.userAgent,document)).parse();return new X(c,b,a)});function Y(a,b){this.c=a;this.d=b;this.m=[]}Y.prototype.D=function(a){var b=x(this.c);return(this.d.api||b+"//use.typekit.net")+"/"+a+".js"};
Y.prototype.v=function(a,b){var c=this.d.id,d=this.d,e=this.c.u,f=this;c?(e.__webfonttypekitmodule__||(e.__webfonttypekitmodule__={}),e.__webfonttypekitmodule__[c]=function(c){c(a,d,function(a,c,d){for(var e=0;e<c.length;e+=1){var g=d[c[e]];if(g)for(var Q=0;Q<g.length;Q+=1)f.m.push(new H(c[e],g[Q]));else f.m.push(new H(c[e]))}b(a)})},c=ha(this.c,this.D(c)),t(this.c,"head",c)):b(k)};Y.prototype.load=function(a){a(this.m)};T("typekit",function(a,b){return new Y(b,a)});function za(a,b,c){this.L=a?a:b+Aa;this.p=[];this.Q=[];this.da=c||""}var Aa="//fonts.googleapis.com/css";za.prototype.f=function(){if(0==this.p.length)throw Error("No fonts to load !");if(-1!=this.L.indexOf("kit="))return this.L;for(var a=this.p.length,b=[],c=0;c<a;c++)b.push(this.p[c].replace(/ /g,"+"));a=this.L+"?family="+b.join("%7C");0<this.Q.length&&(a+="&subset="+this.Q.join(","));0<this.da.length&&(a+="&text="+encodeURIComponent(this.da));return a};function Ba(a){this.p=a;this.aa=[];this.I={}}
var Ca={latin:"BESbswy",cyrillic:"&#1081;&#1103;&#1046;",greek:"&#945;&#946;&#931;",khmer:"&#x1780;&#x1781;&#x1782;",Hanuman:"&#x1780;&#x1781;&#x1782;"},Da={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ea={i:"i",italic:"i",n:"n",normal:"n"},Fa=RegExp("^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$");
Ba.prototype.parse=function(){for(var a=this.p.length,b=0;b<a;b++){var c=this.p[b].split(":"),d=c[0].replace(/\+/g," "),e=["n4"];if(2<=c.length){var f;var g=c[1];f=[];if(g)for(var g=g.split(","),h=g.length,n=0;n<h;n++){var m;m=g[n];if(m.match(/^[\w]+$/)){m=Fa.exec(m.toLowerCase());var r=j;if(m==l)r="";else{r=j;r=m[1];if(r==l||""==r)r="4";else var oa=Da[r],r=oa?oa:isNaN(r)?"4":r.substr(0,1);r=[m[2]==l||""==m[2]?"n":Ea[m[2]],r].join("")}m=r}else m="";m&&f.push(m)}0<f.length&&(e=f);3==c.length&&(c=c[2],
f=[],c=!c?f:c.split(","),0<c.length&&(c=Ca[c[0]])&&(this.I[d]=c))}this.I[d]||(c=Ca[d])&&(this.I[d]=c);for(c=0;c<e.length;c+=1)this.aa.push(new H(d,e[c]))}};function Z(a,b,c){this.a=a;this.c=b;this.d=c}var Ga={Arimo:k,Cousine:k,Tinos:k};Z.prototype.v=function(a,b){b(a.k.w)};Z.prototype.load=function(a){var b=this.c;if("MSIE"==this.a.getName()&&this.d.blocking!=k){var c=s(this.X,this,a),d=function(){b.z.body?c():setTimeout(d,0)};d()}else this.X(a)};
Z.prototype.X=function(a){for(var b=this.c,c=new za(this.d.api,x(b),this.d.text),d=this.d.families,e=d.length,f=0;f<e;f++){var g=d[f].split(":");3==g.length&&c.Q.push(g.pop());var h="";2==g.length&&""!=g[1]&&(h=":");c.p.push(g.join(h))}d=new Ba(d);d.parse();t(b,"head",u(b,c.f()));a(d.aa,d.I,Ga)};T("google",function(a,b){var c=(new C(navigator.userAgent,document)).parse();return new Z(c,b,a)});function $(a,b){this.c=a;this.d=b;this.m=[]}$.prototype.D=function(a){return x(this.c)+(this.d.api||"//f.fontdeck.com/s/css/js/")+(this.c.u.location.hostname||this.c.G.location.hostname)+"/"+a+".js"};
$.prototype.v=function(a,b){var c=this.d.id,d=this.c.u,e=this;c?(d.__webfontfontdeckmodule__||(d.__webfontfontdeckmodule__={}),d.__webfontfontdeckmodule__[c]=function(a,c){for(var d=0,n=c.fonts.length;d<n;++d){var m=c.fonts[d];e.m.push(new H(m.name,ma("font-weight:"+m.weight+";font-style:"+m.style)))}b(a)},c=ha(this.c,this.D(c)),t(this.c,"head",c)):b(k)};$.prototype.load=function(a){a(this.m)};T("fontdeck",function(a,b){return new $(b,a)});window.WebFontConfig&&U.load(window.WebFontConfig);
})(this,document);

});
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-upload/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('emitter');

/**
 * Expose `Upload`.
 */

module.exports = Upload;

/**
 * Initialize a new `Upload` file`.
 * This represents a single file upload.
 *
 * Events:
 *
 *   - `error` an error occurred
 *   - `abort` upload was aborted
 *   - `progress` upload in progress (`e.percent` etc)
 *   - `end` upload is complete
 *
 * @param {File} file
 * @api private
 */

function Upload(file) {
  if (!(this instanceof Upload)) return new Upload(file);
  Emitter.call(this);
  this.file = file;
  file.slice = file.slice || file.webkitSlice;
}

/**
 * Mixin emitter.
 */

Emitter(Upload.prototype);

/**
 * Upload to the given `path`.
 *
 * @param {String} path
 * @param {Function} [fn]
 * @api public
 */

Upload.prototype.to = function(path, fn){
  // TODO: x-browser
  var self = this;
  fn = fn || function(){};
  var req = this.req = new XMLHttpRequest;
  req.open('POST', path);
  req.onload = this.onload.bind(this);
  req.onerror = this.onerror.bind(this);
  req.upload.onprogress = this.onprogress.bind(this);
  req.onreadystatechange = function(){
    if (4 == req.readyState) {
      var type = req.status / 100 | 0;
      if (2 == type) return fn(null, req);
      var err = new Error(req.statusText + ': ' + req.response);
      err.status = req.status;
      fn(err);
    }
  };
  var body = new FormData;
  body.append('file', this.file);
  req.send(body);
};

/**
 * Abort the XHR.
 *
 * @api public
 */

Upload.prototype.abort = function(){
  this.emit('abort');
  this.req.abort();
};

/**
 * Error handler.
 *
 * @api private
 */

Upload.prototype.onerror = function(e){
  this.emit('error', e);
};

/**
 * Onload handler.
 *
 * @api private
 */

Upload.prototype.onload = function(e){
  this.emit('end', this.req);
};

/**
 * Progress handler.
 *
 * @api private
 */

Upload.prototype.onprogress = function(e){
  e.percent = e.loaded / e.total * 100;
  this.emit('progress', e);
};

});
require.register("component-normalized-upload/index.js", function(exports, require, module){

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

});
require.register("enome-components-angular-enter-directive/index.js", function(exports, require, module){
var mod = window.angular.module('ngEnter', [ require('angular-safe-apply') ]);

mod.directive('ngEnter', function ($parse, safeApply) {

  return function (scope, element, attrs) {

    element.bind('keydown', function (event) {

      var fn = $parse(attrs['ngEnter']);

      if (event.which === 13) {

        safeApply(scope, function () {
          fn(scope, { $event : event });
        });

      }

    });

  };

});

module.exports = 'ngEnter';

});
require.register("enome-components-angular-droparea/index.js", function(exports, require, module){
var mod = window.angular.module('droparea', []);
var normalize = require('normalized-upload');

mod.directive('droparea', function ($document) {

  return {

    restrict: 'E',
    template: '<div class="droparea">Drop</div>',
    replace: true,
    scope: { files: '=' },
    link: function ($scope, el, attrs) {

      var drags = 0;

      el.css('display', 'none');

      window.addEventListener('dragenter', function (e) {
        drags += 1;
        el.css('display', 'block');
      });

      window.addEventListener('dragleave', function (e) {
        drags -= 1;
        if (drags === 0) {
          el.css('display', 'none');
        }
      });

      el[0].addEventListener('dragenter', function (e) {
        el.addClass('over');
        e.preventDefault();
        return false;
      });

      el[0].addEventListener('dragover', function (e) {
        e.preventDefault();
        return false;
      });

      el[0].addEventListener('dragleave', function (e) {
        el.removeClass('over');
      });

      el[0].addEventListener('drop', function (e) {
        drags = 0;

        $scope.files.length = 0;
        normalize(e, function (e) {
          $scope.$apply(function () {
            $scope.files.push.apply($scope.files, e.items);
          });
        });

        el.css('display', 'none');
        el.removeClass('over');
        e.stopPropagation();
        e.preventDefault();
        return false;
      });


    }

  };

});

module.exports = 'droparea';

});
require.register("enome-components-angular-safe-apply/index.js", function(exports, require, module){
var mod = window.angular.module('safeApply', []);

mod.factory('safeApply', [ function ($rootScope) {
  return function ($scope, fn) {
    var phase = $scope.$root.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn) {
        $scope.$eval(fn);
      }
    } else {
      if (fn) {
        $scope.$apply(fn);
      } else {
        $scope.$apply();
      }
    }
  }
}]);

module.exports = 'safeApply';

});
require.register("enome-components-angular-file-manager/index.js", function(exports, require, module){
require('webfont');

var mod = window.angular.module('file-manager', [
  require('angular-safe-apply'),
  require('angular-enter-directive'),
  require('angular-droparea'),
  require('./js/breadcrumbs'),
  require('./js/extra-events'),
  require('./js/directories'),
  require('./js/files')
]);

mod.run(function ($templateCache) {
  window.WebFont.load({ google: { families: ['Roboto Condensed:300'] } });
});

mod.directive('fileManager', function () {
  return {
    restrict: 'E',
    template: require('./template'),
    replace: true,
    scope: { url: '=', selected: '=selected' },
    controller: function ($scope, $timeout) {

      if (typeof $scope.selected === 'undefined') {
        $scope.selected = [];
      }

      $scope.path = '/';

      $scope.link = function (path) {
        $scope.path = path;
      };

      $scope.select = function (item, checked) {

        if (checked) {
          return $scope.selected.push(item.path);
        }

        $scope.selected.splice($scope.selected.indexOf(item.path), 1);

      };

      $scope.update_selected = function (old_path, new_path) {

        if ($scope.selected.some(function (path) { return path === old_path; })) {
          $scope.selected.splice($scope.selected.indexOf(old_path), 1, new_path);
        }

      };

      $scope.remove_selected = function (path) {

        var i;
        var re = new RegExp('^' + path.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") + '($|/)');

        for (i = $scope.selected.length - 1; i >= 0; i -= 1) {
          if (re.test($scope.selected[i])) {
            $scope.selected.splice(i, 1);
          }
        }

      };

      $scope.enableRead = function (i) {

        if (i.readonly === '') {
          return;
        }

        if (typeof i.stos === 'undefined') {
          i.stos = [];
        }

        i.stos.push($timeout(function () {
          i.readonly = '';
        }, 250, true));

      };

      $scope.enableReadonly = function (i) {
        i.readonly = 'readonly';
      };

      $scope.unfocus = function (e) {
        e.target.blur();
      };

    }

  };

});

module.exports = 'file-manager';

});
require.register("enome-components-angular-file-manager/js/breadcrumbs.js", function(exports, require, module){
var mod = window.angular.module('breadcrumbs', []);

var pathToNavigation = function (path) {

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

};

mod.directive('breadCrumbs', function () {
  return {
    restrict: 'E',
    template: '<span ng-repeat="part in path_navigation"> / <button ng-click="navigate(part.path)" title="{{part.name}}">{{ part.name }}</button></span>',
    scope: {
      path: '='
    },
    controller: function ($scope) {
      $scope.$watch('path', function (v) {
        if (v) {
          $scope.path_navigation = pathToNavigation(v);
        }
      });

      $scope.navigate = function (p) {
        $scope.path = p;
      };
    }

  };

});

module.exports = 'breadcrumbs';

});
require.register("enome-components-angular-file-manager/js/extra-events.js", function(exports, require, module){
var mod = window.angular.module('extra-events', []);

mod.directive([ 'focus', 'blur', 'keyup', 'keydown', 'keypress' ].reduce(function (container, name) {

  var directiveName = 'ng' + name[0].toUpperCase() + name.substr(1);

  container[directiveName] = ['$parse', 'safeApply', function ($parse, safeApply) {

    return function (scope, element, attr) {

      var fn = $parse(attr[directiveName]);

      element.bind(name, function (event) {

        safeApply(scope, function () {
          fn(scope, { $event : event });
        });

        event.stopPropagation();

      });

    };

  }];

  return container;

}, {}));

module.exports = 'extra-events';

});
require.register("enome-components-angular-file-manager/js/directories.js", function(exports, require, module){
var mod = window.angular.module('directories', []);

mod.controller('DirectoriesCtrl', function ($scope, $http) {

  $scope.directories = [];

  $scope.$watch('path', function (v) {

    if (!v) { return; }

    var GET = $http.get($scope.url + '/directories/' + $scope.path);

    GET.success(function (data, status, headers, config) {
      $scope.directories.length = 0;
      $scope.directories.push.apply($scope.directories, data);
    });

    GET.error(function (data, status, headers, config) {
      console.log('error');
    });

  });

  $scope.create = function (e) {

    if (!$scope.directory_name) {
      return;
    }

    var data = {
      path: $scope.path,
      name: $scope.directory_name.replace(/\//g, '')
    };

    var contains = $scope.directories.some(function (directory) {
      return directory.path === ($scope.path + '/' + $scope.directory_name).replace('//', '/');
    });

    if (contains) {
      alert(data.name + ' already exists');
      return;
    }
    
    var POST = $http.post($scope.url + '/directories/', data);

    POST.success(function (data) {
      $scope.directory_name = '';
      $scope.directories.push(data);
    });

    POST.error(function () {
      alert('Server error');
    });

    e.preventDefault();

  };

});

mod.controller('DirectoryCtrl', function ($scope, $http, $timeout) {

  $scope.directory.readonly = 'readonly';

  $scope.remove = function (directory) {
    var DEL = $http.delete($scope.url + '/directories/' + directory.path);

    DEL.success(function (data) {
      var i = $scope.directories.indexOf(directory);
      $scope.directories.splice(i, 1);
      $scope.remove_selected(directory.path);
    });

    DEL.error(function (data) {
      alert('Server error');
    });
  };

  $scope.storeName = function (directory) {
    $scope.old_name = directory.name;
  };

  $scope.update = function (directory) {

    if (directory.name === '') {
      directory.name = $scope.old_name;
      return;
    }

    if (directory.name !== $scope.old_name) {

      var contains = $scope.directories.some(function (f) {
        return f.path === ($scope.path + '/' + directory.name).replace('//', '/');
      });

      if (contains) {
        alert(directory.name + ' already exists');
        directory.name = $scope.old_name;
        return;
      }

      var data = {
        path: $scope.path,
        name: directory.name.replace(/\//g, ''),
        old_name: $scope.old_name
      };

      var PUT = $http.put($scope.url + '/directories/', data);

      PUT.success(function (response) {
        $scope.update_selected(directory.path, response.path);
        directory.path = response.path;
        directory.name = response.name;
      });

      PUT.error(function () {
        directory.name = $scope.old_name;
      });
    }

    $scope.enableReadonly(directory);

  };

  $scope.s = $scope.selected.some(function (path) {
    return $scope.directory.path === path;
  });

  $scope.visit = function (directory) {

    if (directory.readonly === '') {
      return;
    }

    directory.stos.forEach(function (sto) {
      $timeout.cancel(sto);
    });

    directory.stos.length = 0;

    $scope.link(directory.path);

  };

});

module.exports = 'directories';

});
require.register("enome-components-angular-file-manager/js/files.js", function(exports, require, module){
var mod = window.angular.module('files', []);
var Upload = require('upload');

mod.controller('FilesCtrl', function ($scope, $http) {

  $scope.uploaded_files = [];
  $scope.files = [];

  $scope.$watch('path', function (v) {

    if (!v) { return; }

    var GET = $http.get($scope.url + '/files/' + $scope.path);

    GET.success(function (data, status, headers, config) {
      $scope.files.length = 0;
      $scope.files.push.apply($scope.files, data);
    });

    GET.error(function (data, status, headers, config) {
      alert('Server Error');
    });

  });

  $scope.$watch('uploaded_files.length', function (v) {

    if (v === 0) { return; }

    $scope.uploaded_files.forEach(function (file) {

      if (file.kind !== 'file') { return; }

      var data = {
        name: file.name,
        path: ($scope.path + '/' + file.name).replace('//', '/'),
        progress: 0,
        uploading: true
      };

      var contains = $scope.files.some(function (file) {
        return file.path === data.path;
      });

      if (contains) {
        alert(data.name + ' already exists');
        return;
      }

      $scope.files.push(data);

      var upload = new Upload(file);

      upload.to($scope.url + '/files/' + $scope.path);

      upload.on('end', function (e) {
        $scope.$apply(function () {
          data.uploading = false;
        });
      });

      upload.on('error', function (e) {
        alert('Server Error');
      });

      upload.on('progress', function (e) {
        $scope.$apply(function () {
          data.progress = parseInt(Math.ceil(e.percent), 10);
        });
      });

    });

    $scope.uploaded_files.length = 0;

  });

});

mod.controller('FileCtrl', function ($scope, $http, $timeout) {

  $scope.file.readonly = 'readonly';

  $scope.remove = function (file) {

    var DEL = $http.delete($scope.url + '/files/' + file.path);

    DEL.success(function (data) {
      var i = $scope.files.indexOf(file);
      $scope.files.splice(i, 1);
      $scope.remove_selected(file.path);
    });

  };

  $scope.storeName = function (file) {
    $scope.old_name = file.name;
  };

  $scope.update = function (file) {

    if (file.name === '') {
      file.name = $scope.old_name;
      return;
    }


    if (file.name !== $scope.old_name) {

      var contains = $scope.files.some(function (f) {
        return f.path === ($scope.path + '/' + file.name).replace('//', '/');
      });

      if (contains) {
        alert(file.name + ' already exists');
        file.name = $scope.old_name;
        return;
      }

      var data = {
        path: $scope.path,
        name: file.name.replace(/\//g, ''),
        old_name: $scope.old_name
      };

      var PUT = $http.put($scope.url + '/files/', data);

      PUT.success(function (response) {
        $scope.update_selected(file.path, response.path);
        file.path = response.path;
        file.name = response.name;
      });

      PUT.error(function () {
        file.name = $scope.old_name;
      });

    }

    $scope.enableReadonly($scope.file);

  };

  $scope.$watch('selected.length', function () {
    $scope.s = $scope.selected.some(function (path) {
      return $scope.file.path === path;
    });
  });

  $scope.preview = function (file) {

    if (file.readonly === '') {
      return;
    }

    file.stos.forEach(function (sto) {
      $timeout.cancel(sto);
    });

    file.stos.length = 0;
    window.open($scope.url + '/files/' +  file.path, '_blank');
  };

});

module.exports = 'files';

});
require.register("enome-components-angular-file-manager/template.js", function(exports, require, module){
module.exports = '<div class=\'file-manager\'>\n  <header>\n    <bread-crumbs path=\'path\'></bread-crumbs>\n  </header>\n\n  <div ng-controller=\'DirectoriesCtrl\'>\n\n    <h2><i class=\'icon-folder-close-alt\'></i> Directories</h2>\n\n    <div class=\'row directory_create\'>\n      <input type=\'text\' placeholder=\'New directory name\' ng-model=\'directory_name\' ng-enter=\'create($event)\'/>\n    </div>\n\n    <div class=\'row\' ng-controller=\'DirectoryCtrl\' ng-repeat=\'directory in directories\'>\n\n      <div class=\'col1\' ng-click=\'link(directory.path)\'>\n        <i class=\'icon-folder-close-alt\'></i>\n      </div>\n\n      <div class=\'col2\'>\n        <input class=\'inline\' type=\'text\' \n               ng-model=\'directory.name\' \n               ng-focus=\'storeName(directory)\' \n               ng-blur=\'update(directory)\' \n               ng-readonly=\'directory.readonly\' \n               ng-dblclick=\'visit(directory)\' \n               ng-enter=\'unfocus($event)\'\n               ng-click=\'enableRead(directory)\'/>\n  \n      </div>\n\n      <div class=\'col3\'>\n        <button ng-click=\'remove(directory);\'><i class=\'icon-trash\'></i></button>\n      </div>\n\n    </div>\n\n  </div>\n\n  <div ng-controller=\'FilesCtrl\' class=\'files\'>\n\n    <h2><i class=\'icon-file-text-alt\'></i> Files</h2>\n\n    <droparea class=\'droparea\' files=\'uploaded_files\'></droparea>   \n\n    <div class=\'row file\' ng-controller=\'FileCtrl\' ng-repeat=\'file in files\'>\n\n      <div class=\'col1\'>\n        <input type=\'checkbox\' ng-change=\'select(file, s)\' ng-model=\'s\' />\n      </div>\n\n      <div class=\'col2\'>\n        <input class=\'inline\' type=\'text\' \n               ng-model=\'file.name\' \n               ng-focus=\'storeName(file)\'\n               ng-blur=\'update(file)\'\n               ng-readonly=\'file.readonly\'\n               ng-enter=\'unfocus($event)\'\n               ng-click=\'enableRead(file)\'\n               ng-dblclick=\'preview(file)\' />\n      </div>\n\n      <div class=\'col3\' ng-show=\'file.uploading\'>{{file.progress}}%</div>\n\n      <div class=\'col3\' ng-show=\'!file.uploading\'>\n        <button ng-click=\'remove(file)\'><i class=\'icon-trash\'></i></button>\n      </div>\n    </div>\n\n  </div>\n\n</div>\n';
});
require.register("enome-components-angular-markdown-editor/index.js", function(exports, require, module){
require('webfont');

var mod = window.angular.module('markdown-editor', [
  require('angular-file-manager')
]);

mod.run(['$templateCache', function ($templateCache) {
  window.WebFont.load({ google: { families: ['Open Sans:300,400,700', 'Droid Serif:400'] } });
}]);

var directives = require('./src/directives');
var controllers = require('./src/controllers');
var filters = require('./src/filters');
var factories = require('./src/factories');

mod.directive('markdownEditor', directives.markdownEditor);
mod.controller('MarkdownEditorCtrl', controllers.MarkdownEditorCtrl);
mod.filter('markdown', filters.markdown);
mod.factory('stringBuilder', factories.stringBuilder);
mod.factory('selection', factories.selection);

module.exports = 'markdown-editor';

});
require.register("enome-components-angular-markdown-editor/template.js", function(exports, require, module){
module.exports = '<div class=\'markdowneditor\'>\n\n  <div class=\'actionbar\'>\n    <button type=\'button\' ng-click=\'toggleFileManager()\' title=\'Insert images and files\'>Insert file</button>\n  </div>\n\n  <div class=\'insert\'>\n    <textarea ng-model=\'data\' autofocus></textarea>\n  </div>\n\n  <div class=\'preview markdown\' ng-bind-html-unsafe=\'data|markdown\'></div>\n\n  <div ng-show=\'show_file_manager\' class=\'file-manager-overlay\'>\n    <file-manager url=\'fileserver\' selected=\'selected_files\'></file-manager>\n    <div class=\'actions\'>\n      <button type=\'button\' ng-click=\'insertImage()\' ng-disabled=\'!selected_files.length\'>Insert As Image</button>\n      <button type=\'button\' ng-click=\'insertLink()\' ng-disabled=\'!selected_files.length\'>Insert As Link</button>\n      <button type=\'button\' ng-click=\'toggleFileManager()\'>Cancel</button>\n    </div>\n  </div>\n\n</div>\n';
});
require.register("enome-components-angular-markdown-editor/src/controllers.js", function(exports, require, module){
var controllers = {

  MarkdownEditorCtrl: function ($scope, $timeout, stringBuilder) {

    $scope.selected_files = [];
    $scope.show_file_manager = false;

    $scope.toggle = function () {
      $scope.fullscreen = !$scope.fullscreen;
    };

    $scope.selection = { start: 0, end: 0 };

    $scope.toggleFileManager = function () {
      $scope.show_file_manager = !$scope.show_file_manager;
    };

    var reset = function () {
      $scope.selected_files.length = 0;
      $scope.toggleFileManager();
      $timeout(function () { $scope.focusTextarea(); }, 0);
    };

    $scope.insertImage = function () {

      var data = stringBuilder($scope.data, $scope.selection.start, $scope.selection.end);

      $scope.selected_files.forEach(function (file) {
        data.add('![' + file.split('/').pop() + '](' + $scope.fileserver + window.escape(file) + ')');
      });

      $scope.data = data.build();
      $scope.selection.end = $scope.selection.start + data.length;
      reset();

    };

    $scope.insertLink = function () {

      var data = stringBuilder($scope.data, $scope.selection.start, $scope.selection.end);

      $scope.selected_files.forEach(function (file) {
        data.add('[' + file.split('/').pop() + '](' + $scope.fileserver + window.escape(file) + ')');
      });

      $scope.data = data.build();
      $scope.selection.end = $scope.selection.start + data.length;
      reset();

    };

  }

};

module.exports = controllers;

});
require.register("enome-components-angular-markdown-editor/src/directives.js", function(exports, require, module){
var directives = {

  markdownEditor: function (selection) {

    return {
      restrict: 'E',
      controller: 'MarkdownEditorCtrl',
      template: require('../template'),
      replace: true,
      scope: { data: '=', fileserver: '=' },
      link: function (scope, element, attr) {

        if (typeof scope.data === 'undefined') {
          scope.data = '';
        }

        var textarea = element.find('textarea');

        textarea.bind('blur', function (e) {
          var self = this;
          scope.$apply(function () {
            scope.selection = { start: self.selectionStart, end: self.selectionEnd };
          });
        });

        scope.focusTextarea = function () {
          selection.setRange(textarea[0], scope.selection.start, scope.selection.end);
        };

        // Open links in target='_blank'
        
        element.bind('click', function (e) {

          if (e.target.tagName === 'A') {
            window.angular.element(e.target).attr('target', '_blank');
          }

        });

      }
    };

  },

};

module.exports = directives;

});
require.register("enome-components-angular-markdown-editor/src/filters.js", function(exports, require, module){
var marked = require('marked');

var filters = {

  markdown: function () {

    return function (input) {
      if (input) {
        return marked(input);
      }
      return '';
    };

  }

};

module.exports = filters;

});
require.register("enome-components-angular-markdown-editor/src/factories.js", function(exports, require, module){
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

});
require.register("enome-components-angular-markdown-textarea/index.js", function(exports, require, module){
var mod = window.angular.module('markdown-textarea', [
  require('angular-markdown-editor')
]);

mod.directive('markdownTextarea', function () {

  return {
    restrict: 'E',
    template: require('./template'),
    replace: true,
    scope: { data: '=', fileserver: '=' },
    link: function (scope, el, attr) {
      scope.$watch('show_editor', function (v) {
        if (v) {
          window.document.body.style.overflow = 'hidden';
          return;
        }

        window.document.body.style.overflow = 'inherit';
      });
    },
    controller: function ($scope) {
      $scope.show_editor = false;

      $scope.toggle = function () {
        $scope.show_editor = !$scope.show_editor;
      };
    }

  };

});

module.exports = 'markdown-textarea';

});
require.register("enome-components-angular-markdown-textarea/template.js", function(exports, require, module){
module.exports = '<div class=\'markdown-textarea\'>\n  <div class=\'textarea-container\'>\n    <button type=\'button\' ng-click=\'toggle()\' title=\'Show fullscreen editor\'><i class=\'icon-resize-full\'></i></button>\n    <textarea ng-model=\'data\'></textarea>\n  \n  </div>\n  <div class=\'overlay\' ng-show=\'show_editor\'>\n    <button type=\'button\' ng-click=\'toggle()\' title=\'Hide fullscreen editor\'><i class=\'icon-resize-small\'></i></button>\n    <markdown-editor data=\'data\' fileserver=\'fileserver\' />\n  </div>\n</div>\n';
});
require.register("enome-components-angular-arrangeable-array/index.js", function(exports, require, module){
// Utils

var move = function (array, pos1, pos2) {
  var i, tmp;
  pos1 = parseInt(pos1, 10);
  pos2 = parseInt(pos2, 10);

  if (pos1 !== pos2 && 0 <= pos1 && pos1 <= array.length && 0 <= pos2 && pos2 <= array.length) {
    tmp = array[pos1];
    if (pos1 < pos2) {
      for (i = pos1; i < pos2; i += 1) {
        array[i] = array[i + 1];
      }
    } else {
      for (i = pos1; i > pos2; i -= 1) {
        array[i] = array[i - 1];
      }
    }
    array[pos2] = tmp;
  }
};

// App

require('webfont');

var mod = window.angular.module('arrangeable-array', []);

mod.directive('arrangeableArray', function ($document) {

  return {

    restrict: 'E',
    scope: { array: '=' },
    template: require('./template'),
    replace: true,
    link: function ($scope, root, attrs) {

      var resetExpand = function () {
        var expanded_dropareas = document.querySelector('.expand');

        if (expanded_dropareas) {
          expanded_dropareas.classList.remove('expand');
        }
      };

      // Events
      
      var dragging_row;
      var drop_row;
      
      root.bind('mousedown', function (e) {

        if (e.target.classList.contains('row') && !e.target.classList.contains('last')) {
          dragging_row = e.target;
        }

        if (e.target.parentNode.classList && e.target.parentNode.classList.contains('row')) {
          dragging_row = e.target.parentNode;
        }

        if (dragging_row) {
          dragging_row.style.width = dragging_row.offsetWidth + 'px';
          dragging_row.offsetY = e.pageY - dragging_row.offsetTop; // FF doesn't support offsetY
          root.css('height', dragging_row.parentNode.offsetHeight + 'px');
          
          e.preventDefault();
          return false;
        }

      });

      // On drop

      root.bind('mouseup', function () {
        
        if (dragging_row) {

          if (drop_row) {

            $scope.$apply(function () {

              var pos1 = dragging_row.getAttribute('data-index');
              var pos2 = drop_row.getAttribute('data-index');

              if (pos1 < pos2) {
                pos2 = pos2 - 1;
              }

              move($scope.array, pos1, pos2);

            });

          }

          dragging_row.style.zIndex = 0;
          dragging_row.style.position = 'relative';
          dragging_row.style.top = 'inherit';
          dragging_row.style.width = 'inherit';

          // Reset

          root.css('height', 'inherit');
          dragging_row = drop_row = null;
          resetExpand();

        }

      });

      root.bind('mousemove', function (e) {

        if (dragging_row) {
          dragging_row.style.position = 'absolute';
          dragging_row.style.zIndex = 10;
          dragging_row.style.top = (e.pageY - dragging_row.offsetY) + 'px';

          var rows = root[0].querySelectorAll('.row');
          var pageY = e.pageY - ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);

          [].forEach.call(rows, function (row) {

            var cords = row.getBoundingClientRect();

            if (e.pageX >= cords.left && e.pageX <= cords.right && pageY >= cords.top && pageY <= cords.bottom) {

              if (row !== dragging_row) {
                drop_row = row;
                resetExpand();
                row.classList.add('expand');
              }

            }

          });

        }

      });

    },

    controller: function ($scope) {

      $scope.remove = function (item) {
        $scope.array.splice($scope.array.indexOf(item), 1);
      };

    }

  };

});

module.exports = 'arrangeable-array';

});
require.register("enome-components-angular-arrangeable-array/template.js", function(exports, require, module){
module.exports = '<div class=\'arrangeable-array\'>\n\n  <div class=\'row\' ng-repeat=\'item in array\' data-index=\'{{$index}}\'>\n    <div class=\'col1\'>{{item}}</div>\n    <div class=\'col2\'>\n      <button type=\'button\' ng-click=\'remove(item)\'><i class=\'icon-remove\'></i></button>\n    </div>\n  </div>\n\n  <div class=\'row last\' data-index=\'{{array.length}}\'></div>\n\n</div>\n';
});
require.register("enome-components-angular-arrangeable-files/index.js", function(exports, require, module){
var mod = window.angular.module('arrangeable-files', [ require('angular-file-manager'), require('angular-arrangeable-array') ]);

mod.directive('arrangeableFiles', function () {

  return {
    restrict: 'E',
    scope: { selected: '=', fileserver: '=' },
    template: require('./template'),
    link: function (scope) {
      scope.$watch('full_screen', function (v) {
        if (v) {
          window.document.body.style.overflow = 'hidden';
          return;
        }

        window.document.body.style.overflow = 'inherit';
      });
    },
    controller: function ($scope) { $scope.full_screen = false; }
  };

});

module.exports = 'arrangeable-files';

});
require.register("enome-components-angular-arrangeable-files/template.js", function(exports, require, module){
module.exports = '<div class=\'arrangeable-files\'>\n\n  <div class=\'default\' ng-show=\'!full_screen\'>\n    <div class=\'header\'>\n      <button type=\'button\' ng-click=\'full_screen = !full_screen\'>Select files</button>\n    </div>\n\n    <arrangeable-array array=\'selected\'></arrangeable-array>\n  </div>\n\n  <div class=\'overlay\' ng-show=\'full_screen\'>\n    <file-manager selected=\'selected\' url=\'fileserver\'></file-manager>\n    <button type=\'button\' ng-click=\'full_screen = !full_screen\'>Close</button>\n  </div>\n\n</div>\n';
});

require.register("enome-oar/index.js", function(exports, require, module){
var oar = function (base) {

  var arr = base || [];
  var handlers = {};
  var nextTick = typeof process !== 'undefined' ? process.nextTick : setTimeout;

  Object.defineProperty(arr, 'on', { value:  function (event, callback) {
    if (typeof handlers[event] === 'undefined') {
      handlers[event] = [];
    }
    handlers[event].push(callback);
  }});

  var proxy = function (method) {

    var args = Array.prototype.slice.call(arguments, 1);
    var result = Array.prototype[method].apply(arr, args);

    nextTick(function () {
      if (typeof handlers[method] !== 'undefined') {
        handlers[method].forEach(function (handler) {
          handler(arr);
        });
      }
    }, 0);

    return result;

  };

  [ 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift' ].forEach(function (method) {
    Object.defineProperty(arr, method, { value: proxy.bind(null, method) });
  });

  return arr;

};

if (module) {
  module.exports = oar;
}

});
require.register("component-trim/index.js", function(exports, require, module){

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
  return str.replace(/\s*$/, '');
};

});
require.register("component-querystring/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var trim = require('trim');

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if ('string' != typeof str) return {};

  str = trim(str);
  if ('' == str) return {};

  var obj = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split('=');
    obj[parts[0]] = null == parts[1]
      ? ''
      : decodeURIComponent(parts[1]);
  }

  return obj;
};

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

exports.stringify = function(obj){
  if (!obj) return '';
  var pairs = [];
  for (var key in obj) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return pairs.join('&');
};

});
require.register("component-underscore/index.js", function(exports, require, module){
//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

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
      unshift          = ArrayProto.unshift,
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
  var _ = function(obj) { return new wrapper(obj); };

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
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.3';

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
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
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
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
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
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
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

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
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
    var result = {computed : Infinity};
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
      rand = Math.floor(Math.random() * ++index);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = lookupIterator(obj, val);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(obj, val) {
    return _.isFunction(val) ? val : function(obj) { return obj[val]; };
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, val, behavior) {
    var result = {};
    var iterator = lookupIterator(obj, val);
    each(obj, function(value, index) {
      var key = iterator(value, index);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    return group(obj, val, function(result, key, value) {
      (result[key] || (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, val) {
    return group(obj, val, function(result, key, value) {
      result[key] || (result[key] = 0);
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var value = iterator(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
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
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
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
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    _.reduce(initial, function(memo, value, index) {
      if (isSorted ? (_.last(memo) !== value || !memo.length) : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, []));
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
    var rest = flatten(slice.call(arguments, 1), true, []);
    return _.filter(array, function(value){ return !_.include(rest, value); });
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

  // Zip together two arrays -- an array of keys and an array of values -- into
  // a single object.
  _.zipObject = function(keys, values) {
    var result = {};
    for (var i = 0, l = keys.length; i < l; i++) {
      result[keys[i]] = values[i];
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
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
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

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
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
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        throttling = true;
        result = func.apply(context, args);
      }
      whenDone();
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
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
    return _.map(obj, _.identity);
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
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(flatten(slice.call(arguments, 1), true, []), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
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
  var eq = function(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
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
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
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
    stack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
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
    return !!(obj && obj.nodeType == 1);
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

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
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
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // List of HTML entities for escaping.
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  // Regex containing the keys listed immediately above.
  var htmlEscaper = /[&<>"'\/]/g;

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return ('' + string).replace(htmlEscaper, function(match) {
      return htmlEscapes[match];
    });
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
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
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\':   '\\',
    "'":    "'",
    r:      '\r',
    n:      '\n',
    t:      '\t',
    u2028:  '\u2028',
    u2029:  '\u2029'
  };

  for (var key in escapes) escapes[escapes[key]] = key;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n((__t=(" + unescape(code) + "))==null?'':_.escape(__t))+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
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

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result(obj, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

});
require.register("jungles-panel-core/index.js", function(exports, require, module){
module.exports = function (jungles) {
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
};

});
require.register("jungles-panel-core/init/index.js", function(exports, require, module){
require('webfont');

var init = function (jungles) {

  jungles.run(function ($http, general, types) {

    window.WebFont.load({ google: { families: ['Roboto Condensed:300'] } });
    var result = $http.get(general.resource_url('/types'));

    result.success(function (response) {
      types.set(response);
    });

  });

};

module.exports = init;

});
require.register("jungles-panel-core/general/controllers.js", function(exports, require, module){
var controllers = {

  PageCtrl: function ($scope, $location) {

    $scope.link = function (url) {
      $location.path(url);
    };

  }

};

module.exports = controllers;

});
require.register("jungles-panel-core/general/directives.js", function(exports, require, module){
var directives = {

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

});
require.register("jungles-panel-core/general/factories.js", function(exports, require, module){
var getParent = function (path) {

  path = path.substring(1);

  var parts = path.split('/');

  parts.pop();

  if (parts.length === 0) {
    return '/';
  }

  return '/' + parts.join('/');

};

var factories = function ($document) {

  var s = {
    resource_url: function (url) {
      return $document[0].getElementById('ResourceUrl').value + url;
    },

    path: {
      parent: getParent
    }

  };

  return s;

};

module.exports = factories;

});
require.register("jungles-panel-core/general/index.js", function(exports, require, module){
var factories = require('./factories');
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

});
require.register("jungles-panel-core/collections/index.js", function(exports, require, module){
var services = require('./services');

var collections = function (app) {
  app.factory('collections', services);
};

module.exports = collections;

});
require.register("jungles-panel-core/collections/services.js", function(exports, require, module){
var services = function () {
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

});
require.register("jungles-panel-core/header/controllers.js", function(exports, require, module){
var controllers = {

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

});
require.register("jungles-panel-core/header/factories.js", function(exports, require, module){
var factories = function () {

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

});
require.register("jungles-panel-core/header/index.js", function(exports, require, module){
var factories = require('./factories');
var controllers = require('./controllers');

var header = function (app) {
  app.factory('header', factories);
  app.controller('HeaderCtrl', controllers.HeaderCtrl);
};

module.exports = header;

});
require.register("jungles-panel-core/alerts/controllers.js", function(exports, require, module){
var controllers = {

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

});
require.register("jungles-panel-core/alerts/factories.js", function(exports, require, module){
var factories = function () {

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

});
require.register("jungles-panel-core/alerts/index.js", function(exports, require, module){
var factories = require('./factories');
var controllers = require('./controllers');

var alerts = function (app) {

  app.factory('alerts', factories);
  app.controller('AlertsCtrl', controllers.AlertsCtrl);

};

module.exports = alerts;

});
require.register("jungles-panel-core/alerts/specs/factories.js", function(exports, require, module){
var factories = require('../factories');

describe('factories', function () {

  describe('flattenValidationErrors', function () {

    it('flattens the validation errors', function () {

      var errors = {
        name: [ 'Should be unique', 'Is empty' ],
        body: [ 'Is empty' ],
      };

      factories().flattenValidationErrors(errors).should.eql([
        {
          type: 'error',
          name: 'name',
          msg: 'Should be unique, Is empty'
        },
        {
          type: 'error',
          name: 'body',
          msg: 'Is empty'
        }
      ]);

    });

  });

});

});
require.register("jungles-panel-core/forms/controllers.js", function(exports, require, module){
var controllers = {

  CreateFormCtrl: function ($scope, $routeParams, $window, instances, collections, general, alerts, _) {

    var max_order = _.max(collections.instances, function (instance) {
      return instance.order;
    });

    $scope.data = {
      type: $routeParams.type,
      parent: $routeParams.parent,
      order: max_order ? max_order.order + 1 : 1
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

});
require.register("jungles-panel-core/forms/index.js", function(exports, require, module){
var controllers = require('./controllers');

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

});
require.register("jungles-panel-core/types/controllers.js", function(exports, require, module){
var controllers = {

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

});
require.register("jungles-panel-core/types/factories.js", function(exports, require, module){
var types = [];

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

});
require.register("jungles-panel-core/types/index.js", function(exports, require, module){
var controllers = require('./controllers');
var factories = require('./factories');

var types = function (app) {
  app.factory('types', factories);
  app.controller('TypesCtrl', controllers.TypesCtrl);
};

module.exports = types;

});
require.register("jungles-panel-core/instances/controllers.js", function(exports, require, module){
var InstancesCtrl = function ($scope, $routeParams, header, instances, collections, general, _) {

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

});
require.register("jungles-panel-core/instances/factories.js", function(exports, require, module){
var oar = require('oar');
var qs = require('querystring');

var factories = function ($http, $rootScope, $window, $location, general, collections, alerts, _) {

  var multipleResultMsg = function (results) {

    var paths = _.map(results, function (instance) { return instance.path; });

    paths.sort(function (a, b) {
      return a.length - b.length;
    });

    if (paths.length > 3) {
      return paths.slice(0, 3).join(', ') + ', ...';
    }

    return paths.join(', ');

  };

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
            msg: multipleResultMsg(response),
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
            msg: multipleResultMsg(response),
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

});
require.register("jungles-panel-core/instances/filters.js", function(exports, require, module){
var filters = {

  selected: function (collections) {

    return function (input) {
      var current = collections.selected.find(input.path);

      if (current) {
        return 'selected';
      }

      return '';
    };

  },


};

module.exports = filters;

});
require.register("jungles-panel-core/instances/index.js", function(exports, require, module){
var controllers = require('./controllers');
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

});
require.register("jungles-panel-core/icons/index.js", function(exports, require, module){
var icons = function (app) {

  app.controller('IconCtrl', function ($scope, types, _) {

    var base = {
      name: 'icon-file-alt',
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

});
require.register("jungles-panel-core/clipboard/controllers.js", function(exports, require, module){
var controllers = {

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

});
require.register("jungles-panel-core/clipboard/factories.js", function(exports, require, module){
var factories = function (collections) {

  
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

});
require.register("jungles-panel-core/clipboard/index.js", function(exports, require, module){
var factories = require('./factories');
var controllers = require('./controllers');

var move = function (app) {
  app.factory('clipboard', factories);
  app.controller('ClipboardCtrl', controllers.ClipboardCtrl);
  app.controller('ClipboardInstanceCtrl', controllers.ClipboardInstanceCtrl);
  app.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);
};

module.exports = move;

});
require.register("jungles-panel-core/header/specs/factories.js", function(exports, require, module){
var factories = require('../factories');

describe('factories', function () {

  it('returns the root navigation', function () {

    factories().pathToNavigation('/').should.eql([
      { path: '/', name: 'Home' }
    ]);

  });

  it('returns the navigation', function () {

    factories().pathToNavigation('/products/skateboard').should.eql([
      { path: '/', name: 'Home' },
      { path: '/products', name: 'products' },
      { path: '/products/skateboard', name: 'skateboard' },
    ]);

  });

});

});
require.register("jungles-panel-core/popups/controllers.js", function(exports, require, module){
var controllers = {

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

});
require.register("jungles-panel-core/popups/index.js", function(exports, require, module){
var controllers = require('./controllers');

var popups = function (jungles) {
  jungles.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);
};

module.exports = popups;

});
require.register("jungles-panel/index.js", function(exports, require, module){
var jungles = window.angular.module('jungles', [
  require('angular-markdown-textarea'),
  require('angular-arrangeable-files')
]);

window.jungles = jungles;

require('jungles-panel-core')(jungles);

});













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