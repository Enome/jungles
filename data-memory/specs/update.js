var update = require('../update');
var eql = require('eql');

describe('Update', function () {

  it('uses old sort', function (done) {
    
    var db = [{ type: 'product', path: '/snowboard', name: 'snowboard', sort: [0] }];

    var result = update(db, { path: '/snowboard', name: 'snow' });

    result.success(function (response) {
      eql(response, { type: 'product', path: '/snow', name: 'snow', sort: [0] });
      done();
    });

  });
  
  it('sets new sort', function (done) {
    
    var db = [{ type: 'product', path: '/snowboard', name: 'snowboard', sort: [0] }];

    var result = update(db, { path: '/snowboard', name: 'snow', order: 1 });

    result.success(function (response) {
      eql(response, { type: 'product', path: '/snow', name: 'snow', sort: [1] });
      done();
    });

  });

  it('updates the children if parent changes', function (done) {

    var db = [
      { type: 'product', path: '/snowboard', name: 'snowboard', sort: [10] },
      { type: 'tag', path: '/snowboard/tags', name: 'tags', sort: [10, 1] }
    ];

    var result = update(db, { path: '/snowboard', name: 'Skate board', order: 20 });

    result.success(function () {

      eql(db, [
        { type: 'product', path: '/skate-board', name: 'Skate board', sort: [20] },
        { type: 'tag', path: '/skate-board/tags', name: 'tags', sort: [20, 1] }
      ]);

      done();
    });

  });

});
