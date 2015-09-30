var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');

//var BaseView = require('../../base-view');
var KscopeVideo = require('./component');

var Scope = {
    init: function () {
        React.render(<KscopeVideo src="" />, document.getElementById('container'));
    }
};

module.exports = Scope;