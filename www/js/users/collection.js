var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var User = require('./model');

var Users = Backbone.Collection.extend({
   model: User,
   url: '../../json/users.json'
});

module.exports = Users;
   


