/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var $ = require('jquery');
var kaleidoscope = require('./modules/kaleidoscope');

var Kscope = React.createBackboneClass({
    update: function(e) {
      var src = e.target.value;
      this.setState({
        src: src
      });
    },
    componentWillMount: function() {
      this.state.kaleidoscope.listener = this;
    },
    componentDidMount: function() {
      this.state.kaleidoscope.move(0, 0);
    },
    getInitialState: function() {
      // Make src local.
      return {
        kaleidoscope: kaleidoscope,
        src: "https://scontent-iad3-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/sh0.08/e35/12331649_749127051897387_1820437710_n.jpg"
      }
    },
    render: function() {
      var imgSrc = this.state.src;
      return (
        <div imgUrl="test" id="sckscope">
          <Widget scopeSize={this.state.kaleidoscope.scopeSize}
            src={this.state.src}
            update={this.update} />
          <CanvasKscope scopeSize="400" src={this.state.src} />
        </div>
      );
    },
    remove: function () {
        this.state.kaleidoscope.stopStream();
        Backbone.View.prototype.remove.apply(this, arguments);
    }
  }),
  CanvasKscope = React.createClass({
    getInitialState: function() {
      return {
        kaleidoscope: kaleidoscope,
        src: this.props.src
      }
    },
    componentDidMount: function() {
      this.state.kaleidoscope.prepPage(this.props.src);
    },
    componentDidUpdate: function() {
      this.state.kaleidoscope.prepPage(this.props.src);
    },
    render: function() {
      var specs = this.props;
      var size = specs.scopeSize;
      var src = specs.src;
      var canvases = [];
      for (var i = 0; i < 6; i++) {
        canvases.push(<canvas key={'kaleidoscope' + i } className="kaleidoscopeCanvas"
          height = {size}
          width = {size} ></canvas>);
        }
        return <div>{canvases}</div>;
      }
    }),
    Widget = React.createClass({
      getInitialState: function() {
        return {
          audio: false,
          kaleidoscope: kaleidoscope
        };
      },
      fullscreenBrowser: function(body, requestMethod) {
        if (requestMethod) {
            requestMethod.call(body);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
      },
      fullscreenToggle: function(e) {
        var body = document.body;
        var bodyClasses = body.className;
        if (e.target.checked) {
          var requestMethod = body.requestFullScreen || body.webkitRequestFullScreen || body.mozRequestFullScreen || body.msRequestFullscreen;
          this.fullscreenBrowser(body, requestMethod);
          body.className = bodyClasses + (bodyClasses ? ' ' : '') + 'fullscreen';
          this.setState({
            fullscreen: true
          });
        } else {
          var requestMethod = document.cancelFullScreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.exitFullscreen;
          this.fullscreenBrowser(document, requestMethod);
          body.className = body.className.replace(/ ?fullscreen/, '');
          this.setState({
            fullscreen: false
          });
        }
      },
      move: function(e) {
        this.state.kaleidoscope.move(e.target.value, e.target.value);
      },
      moveToggle: function(e) {
        if (e.target.checked) {
          this.state.kaleidoscope.visualizeAudio();
          this.setState({
            audio: true
          });
        } else {
          this.state.kaleidoscope.visualizeAudio(true);
          this.setState({
            audio: false,
            fullscreen: false
          });
        }
      },
      render: function() {
        var specs = this.props;
        var size = specs.scopeSize;
        var src = specs.src;
        var checkboxAudio = (
          <span> Use Audio:
            <input type="checkbox" className="" defaultChecked={this.state.audio} onChange={ this.moveToggle } />
          </span>
        );
        var checkboxFullscreen = (
          <span> Use Fullscreen:
            <input type="checkbox" className="" defaultChecked={this.state.fullscreen} onChange={ this.fullscreenToggle } />
          </span>
        );
        var range = (
          <span> Manual:
            <input type="range" min="0" max="80" defaultValue="0" name="y-range" onChange={ this.move } className="static-range" />
          </span>
        );
        // For SoundCloud and static images:
        // <input onChange={ this.props.update } name="fieldImg" defaultValue="" />
        return (
          <div>
            <form>
              { checkboxAudio }
              { checkboxFullscreen }
              { !this.state.audio ? range : null }
            </form>
          </div>
      )
    }
  });

module.exports = Kscope;
