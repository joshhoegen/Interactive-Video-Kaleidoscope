/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var UsersIndexScreen = require('./users/component');
//var Users = require('../json/users_l');
(function(){
    var app = Backbone.Router.extend({
        routes: {
            "": "kscopeVideo",
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
        marionette: function() {
            var mTest = require('./mTest/');
            //new mTest();
            console.log('Kitty');
        }
    });
    new app;
    Backbone.history.start();
})()
