import React from 'react';
import kaleidoscope from './js/kaleidoscope/modules/kaleidoscope';
import Header from './js/jhHeader'

import './css/main.scss';

let canvasCount = 6;
let CanvasKscope = React.createClass({

  getInitialState() {
    return {
      // kaleidoscope,
      src: this.props.src
    }
  },
  componentDidMount() {
    kaleidoscope.prepPage(this.props.src);

  },
  componentDidUpdate() {
    kaleidoscope.prepPage(this.props.src);
  },
  render() {
    const specs = this.props;
    const size = specs.scopeSize;
    const src = this.state.size;
    const canvases = [];
    for (let i = 0; i < canvasCount; i++) {
      canvases.push( <canvas key = {
          `kaleidoscope${i}`
        }
        className = "kaleidoscopeCanvas"
        height = {
          size
        }
        width = {
          size
        }> </canvas>);
      }
      return <div > {
        canvases
      } </div>;
    }
  });

let Widget = React.createClass({
  getInitialState() {
    return {
      audio: false,
      kaleidoscope
    };
  },
  fullscreenBrowser(body, requestMethod) {
    if (requestMethod) {
      requestMethod.call(body);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
      const wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  },
  fullscreenToggle(e) {
    const body = document.body;
    const bodyClasses = body.className;
    if (e.target.checked) {
      var requestMethod = body.requestFullScreen || body.webkitRequestFullScreen || body.mozRequestFullScreen || body.msRequestFullscreen;
      this.fullscreenBrowser(body, requestMethod);
      body.className = `${bodyClasses + (bodyClasses ? ' ' : '')}fullscreen`;
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
  move(e) {
    this.state.kaleidoscope.move(e.target.value, e.target.value);
  },
  moveToggle(e) {
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
  render() {
    const specs = this.props;
    const size = specs.scopeSize;
    const src = specs.src;

    return ( <div className="controls">
      <form className="controls-wrapper">
        <label htmlFor="audio">Use Audio: </label>
        <input type = "checkbox"
          name="audio"
          className = ""
          defaultChecked = {
            this.state.audio
          }
          onChange = {
            this.moveToggle
          }
        />
        <label htmlFor="fullscreen">Fullscreen: </label>
        <input type = "checkbox"
          name="fullscreen"
          className = ""
          defaultChecked = {
            this.state.fullscreen
          }
          onChange = {
            this.fullscreenToggle
          }
        />
        <label
          htmlFor="y-range"
          className = {'static-range ' + (!this.state.audio ? 'show' : 'hidden')}>Manual: </label>
          <input type = "range"
            min = "0"
            max = {size/5}
            defaultValue = "0"
            name = "y-range"
            onChange = {
              this.move
            }
            className = {'static-range ' + (!this.state.audio ? 'show' : 'hidden')} />
       </form> </div>
    )
  }
});

export default class App extends React.Component {
  constructor() {
    super();
    this.resizeTimer;
    this.state = {
      // kaleidoscope,
      src: "https://scontent-iad3-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/sh0.08/e35/12331649_749127051897387_1820437710_n.jpg",
      size: this.calculateWidth()
    };
    kaleidoscope.scopeSize = this.state.size;
    kaleidoscope.prepPage();
  }

  calculateWidth() {
    let rowCount = 3;
    canvasCount = 6;
    if (window.outerWidth < 1160) {
      rowCount = 2;
    }
    if (window.outerWidth < 600) {
      rowCount = 1;
      canvasCount = 2;
    }
    return 2 * Math.floor((window.innerWidth / rowCount) / 2);
  }

  // componentDidUpdate() {
  //   window.addEventListener("resize", this.updateDimensions.bind(this));
  // }

  updateDimensions() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.setState({
        size: this.calculateWidth()
      });
      kaleidoscope.scopeSize = this.state.size;
      kaleidoscope.prepPage();
    }, 500);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    kaleidoscope.prepVideo();
    kaleidoscope.move(0, 0);
  }

  render() {
    const imgSrc = this.state.src;
    return (
      <div data-imgUrl="test" id="sckscope">
        <Widget scopeSize={kaleidoscope.scopeSize}
          src={this.state.src}
        />
        <CanvasKscope scopeSize={this.state.size} src={this.state.src} />
        <a href="http://joshhoegen.com">
          <img className="logo" src="./static/media/jh-logo-80.png" alt="Art by Josh Hoegen" />
        </a>
        <Header directions="&#8598; Hover over the top left corner to use controls. Check 'Use Audio' with your favorite song!" />
        <video id="video" height={this.state.size + 100} width={this.state.size + 100} autoPlay="true" />
      </div>
    );
  }
}