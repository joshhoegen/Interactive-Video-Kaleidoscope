//var BaseView = require('../base-view');
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var PagesList = require('./component');
var pageShow = require('./show/component');
var pagesC = require('./collection');

var pagesIndexView = {
  init: function () {
    console.log('list()');
    var pages = new pagesC().fetch({
        error: function(c, r, o) {
          // collection, response, options
          console.log(c);
          console.log(r);
          console.log(o);
        },
        success: function(c, r, o) {
          React.render(<PagesList pages={r} />, document.getElementById('external-links'));
        }
    });
  }
};

module.exports = pagesIndexView;
