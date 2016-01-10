var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');

var User = Backbone.Model.extend({
  idAttribute: 'uid',
  url : function() {
    return '../../json/pages.json';
  }
});

module.exports = User;
