/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var Pages = require('./pages');
var Kscope = require('./kaleidoscope');
var KscopeVideo = require('./kaleidoscope/video');
//var Users = require('../json/users_l');
(function(){
    var app = Backbone.Router.extend({
        routes: {
            "": "kscopeVideo",
            "kscope": "kscope",
            "kscope/video": "kscopeVideo",
            "pages": "pages"
        },
        kscope: function() {
            Kscope.init();
            Pages.init();
        },
        kscopeVideo: function() {
            KscopeVideo.init();
            Pages.init();
        }
    });
    new app;
    Backbone.history.start();
})()
