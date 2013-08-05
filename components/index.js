var components = {

  upload: {
    name: 'upload',
    js: __dirname + '/upload/build/upload.js',
    css: __dirname + '/upload/build/upload.css',
    assets: __dirname + '/upload/build/assets',
  },

  markdowneditor: {
    name: 'markdowneditor',
    js: __dirname + '/markdowneditor/build/index.js',
    css: __dirname + '/markdowneditor/build/index.css',
    assets: __dirname + '/markdowneditor/src/assets',
  },

  /*
  tinymce: {
    name: 'tinymce',
    js: __dirname + '/tinymce/build/index.js',
    //css: __dirname + '/tinymce/build/index.css',
    assets: __dirname + '/tinymce/src/tinymce',
  },
  */

};

module.exports = components;
