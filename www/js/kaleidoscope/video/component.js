/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var app = require('../app');
var Kscope = require('../component');

var KscopeVideo = React.createBackboneClass({
    update: function (e) {
        var src = e.target.value;
        this.setState({
            src: src
        });
        //this.state.app.prepPage(src);
    },
    move: function (e) {
        this.state.app.move(e.target.value, e.target.value);
    },
    componentWillMount: function () {
        this.state.app.listener = this;
    },
    componentDidMount: function () {
        console.log('Video Did Mount');
        this.state.app.prepVideo();
    },
    getInitialState: function () {
        return {
            app: app,
            src: ""
        }
    },
    render: function () {
        console.log('kscope');
        return (
            <div imgUrl="test"
                 id="sckscopeVideo">
                <Kscope src=""/>
                <video id="video" height="0" width="0" autoplay="true" />
            </div>
        );
    }
});

module.exports = KscopeVideo;
