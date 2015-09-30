/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var ReactCanvas = require('react-canvas');

var app = require('../app');

var Surface = ReactCanvas.Surface;
//var drawKaleidoscope = require('./modules/kaleidoscope');
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
    componentDidUpdate: function () {
        //this.state.app.prepVideo();
        console.log('Video Did Update');
        //console.log(this.props.src);
    },
    getInitialState: function () {
        return {
            app: app,
            src: ""
        }
    },
    render: function () {
        console.log('kscope');
        var imgSrc = this.props.src;
        return (
            <div imgUrl="test"
                 id="sckscopeVideo">
                <Kscope src=""/>
                <canvas id="preCanvas" width="500" height="500" scopeSize="1000" src={this.state.src}/>
                <video id="video" autoplay="true" />
            </div>
        );
    }
});

module.exports = KscopeVideo;