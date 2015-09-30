/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var ReactCanvas = require('react-canvas');
var $ = require('jquery');

var Surface = ReactCanvas.Surface;

var app = require('./app');


var Kscope = React.createBackboneClass({
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
        getInitialState: function () {
            return {
                app: app,
                src: "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/11363716_134653433554276_1743669472_n.jpg"
            }
        },
        render: function () {
            console.log('kscope');
            var imgSrc = this.props.src || "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/11363716_134653433554276_1743669472_n.jpg";
            return (
                <div imgUrl="test"
                     id="sckscope">
                    <Widget scopeSize={this.state.app.scopeSize}
                            src={this.state.src}
                            update={this.update}
                            move={this.move}/>
                    <CanvasKscope scopeSize="1000" src={this.state.src}/>
                </div>
            );
        }
    }),
    CanvasKscope = React.createClass({
        getInitialState: function () {
            return {
                app: app,
                src: this.props.src
            }
        },
        componentDidUpdate: function () {
            this.state.app.prepPage(this.props.src);
            console.log('Canvas Did Update');
            console.log(this.props.src);
        },
        render: function () {
            console.log('canvas');
            var specs = this.props;
            var size = specs.scopeSize;
            var src = specs.src;
            return (
                <canvas id="canvasCheck"
                        className="kaleidoscope"
                        height={size}
                        width={size}></canvas>
            );
        }
    }),
    Widget = React.createClass({
        render: function () {
            console.log('widget');
            /*position: 'absolute',
             left: '-9999px',
             margin: '0px',
             padding: '0px'*/
            var style = {
                    float: 'left',
                    marginRight: '10px'
                };
            var specs = this.props;
            var size = specs.scopeSize;
            var src = specs.src;
            return (
                <div>
                    <input onChange={this.props.update}
                           name="fieldImg"
                           defaultValue=""
                        />
                    Move: <input type="range" min="0" max="1000" name="y-range" onChange={this.props.move}
                                 className="static-range"/>

                    <div id="image-container">
                        <img id="preImg"
                             className="body-kscope img"
                             height={250}
                             width={250}
                             src={src}
                             style={style}
                             alt="kaleidoscope"/>
                    </div>
                </div>
            )
        }
    });

module.exports = Kscope;
