var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');

var BaseView = require('../base-view');
var Kscope = require('./component');

var Scope = {
  init: function () {
    React.render(<Kscope src="" />, document.getElementById('container'));
  }
};

module.exports = Scope;