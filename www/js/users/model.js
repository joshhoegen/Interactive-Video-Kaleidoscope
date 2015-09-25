var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');

var User = Backbone.Model.extend({
  idAttribute: 'uid',
  url : function() {
    // Important! It's got to know where to send its REST calls. 
    // In this case, POST to '/donuts' and PUT to '/donuts/:id'
    //return this.id ? '../../json/users/' + this.id : '../../json/users/';
    return '../../json/users.json';
  }
});

/*// We can pass it default values.
  defaults : {
    id: 0,
    username: "John Doe",
    avatar: "",
    likeCounts: 0
  },*/

module.exports = User;