/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var $ = require('jquery');
var app = require('./app');

var Kscope = React.createBackboneClass({
    update: function(e) {
      var src = e.target.value;
      this.setState({
        src: src
      });
      //this.state.app.prepPage(src);
    },
    componentWillMount: function() {
      this.state.app.listener = this;
    },
    componentDidMount: function() {
      this.state.app.move(0, 0);
      //console.log(this.state.app);
    },
    getInitialState: function() {
      return {
        app: app,
        src: "https://scontent-iad3-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/sh0.08/e35/12331649_749127051897387_1820437710_n.jpg"
      }
    },
    render: function() {
      console.log('kscope');
      var imgSrc = this.state.src;
      // <div id="image-container">
      //     <img id="preImg"
      //          className="body-kscope img"
      //          height={200}
      //          width={200}
      //          src={this.state.src}
      //          style={style}
      //          alt="kaleidoscope"/>
      // </div>
      return (
        <div imgUrl="test" id="sckscope">
          <Widget scopeSize={ this.state.app.scopeSize }
            src={ this.state.src }
            update={ this.update } />
          <CanvasKscope scopeSize="400" src={ this.state.src } />
        </div>
      );
    }
  }),
  CanvasKscope = React.createClass({
      getInitialState: function() {
        return {
          app: app,
          src: this.props.src
        }
      },
      componentDidMount: function() {
        this.state.app.prepPage(this.props.src);
      },
      componentDidUpdate: function() {
        this.state.app.prepPage(this.props.src);
      },
      render: function() {
        var specs = this.props;
        var size = specs.scopeSize;
        var src = specs.src;
        var canvases = [];
        for (var i = 0; i < 6; i++) {
          canvases.push( <canvas className = "kaleidoscopeCanvas"
            height = {size}
            width = {size} > </canvas>);
          }
          return <div> {canvases} </div>;
        }
      }),
    Widget = React.createClass({
      getInitialState: function() {
        return {
          audio: false,
          app: app
        };
      },
      move: function(e) {
        this.state.app.move(e.target.value, e.target.value);
      },
      moveToggle: function(e) {
        console.log(e.target.checked);
        if (e.target.checked) {
          this.state.app.visualizeAudio();
        } else {
          this.state.app.visualizeAudio(true);
        }
      },
      render: function() {
        var specs = this.props;
        var size = specs.scopeSize;
        var src = specs.src;
        return (
          <div>
            <form>
              Use Audio:
              <input type="checkbox" className="" defaultChecked={this.state.audio} onChange={ this.moveToggle } />
              <input onChange={ this.props.update } name="fieldImg" defaultValue="" /> Move:
              <input type="range" min="0" max="100" defaultValue="0" name="y-range" onChange={ this.move } className="static-range" />
            </form>
          </div>
      )
    }
  });

module.exports = Kscope;
