/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var UsersIndexScreen = require('./users/component');
//var Users = require('../json/users_l');
(function(){
    var app = Backbone.Router.extend({
        routes: {
            "": "index",
            "users": "users",
            "users/:id": "user",
            "kscope": "kscope",
            "kscope/video": "kscopeVideo"
        },
        kscope: function() {
            var Kscope = require('./kaleidoscope');
            Kscope.init();
        },
        kscopeVideo: function() {
            var Kscope = require('./kaleidoscope/video');
            Kscope.init();
        },
        users: function() {
            var UsersIndexView = require('./users');
            UsersIndexView.list();
        },
        user: function(id) {
            var UsersIndexView = require('./users');
            UsersIndexView.show(id);
            
        },
        index: function() {
            var movies = require('./collections/movies');
            var List = require('./component/List');
            React.render(<List movies={movies} />, document.getElementById('container'));
        }
    });
    new app;
    Backbone.history.start();
})()