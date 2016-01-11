var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');

//var BaseView = require('../../base-view');
var KscopeVideo = require('./component');

var Scope = {
    init: function () {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;
      if (navigator.getUserMedia) {
        React.render(<KscopeVideo src="" />, document.getElementById('container'));
      } else {
        React.render(
          <span>
            Your browser does not support the features required to play
            with the Kaleidoscope. Try using Chrome, FireFox, or Edge.
          </span>
          , document.getElementById('messages'));
      }
    }
};

module.exports = Scope;
