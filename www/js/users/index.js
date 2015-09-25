//var BaseView = require('../base-view');
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var UsersList = require('./component');
var UserShow = require('./show/component');
var UsersC = require('./collection');

var UsersIndexView = {
  list: function () {
    var Users = new UsersC().fetch({
        error: function(c, r, o) {
          // collection, response, options
          console.log(c);
          console.log(r);
          console.log(o);
        },
        success: function(c, r, o) {
          React.render(<UsersList users={r} />, document.getElementById('container'));
        }
    });
  },
  show: function(id) {
    var Users = new UsersC().fetch({
        //reset: true,
        error: function(c, r, o) {
          // collection, response, options
          console.log(c);
          console.log(r);
          console.log(o);
        },
        success: function(c, r, o) {
          console.log(c);
          console.log(c.get(id));
          var user = c.get(id);
          React.render(<UserShow user={user} userId={id} />, document.getElementById('container'));
        }
    });
  }
};

module.exports = UsersIndexView;