var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var User = require('./model');

var pages = Backbone.Collection.extend({
   model: User,
   url: '../../json/pages.json'
});

module.exports = pages;
