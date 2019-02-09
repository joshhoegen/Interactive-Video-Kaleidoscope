/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var kaleidoscope = require('../modules/kaleidoscope');
var Kscope = require('../component');

var KscopeVideo = React.createBackboneClass({
    update: function (e) {
        var src = e.target.value;
        this.setState({
            src: src
        });
    },
    move: function (e) {
        this.state.kaleidoscope.move(e.target.value, e.target.value);
    },
    componentWillMount: function () {
        this.state.kaleidoscope.listener = this;
    },
    componentDidMount: function () {
        this.state.kaleidoscope.prepVideo();
    },
    getInitialState: function () {
        return {
            kaleidoscope: kaleidoscope,
            src: ""
        }
    },
    render: function () {
        return (
            <div img-url="test"
                 id="sckscopeVideo">
                <Kscope src=""/>
                <video id="video" height="0" width="0" autoPlay="true" />
            </div>
        );
    }
});

module.exports = KscopeVideo;
