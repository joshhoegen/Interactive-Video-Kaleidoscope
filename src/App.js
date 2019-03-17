import React from 'react'
import PropTypes from 'prop-types'

import kaleidoscope from './js/kaleidoscope/modules/kaleidoscope'
import Header from './js/jhHeader'

import './css/main.scss'

let canvasCount = 6

class CanvasKscope extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // kaleidoscope,
      src: this.props.src,
    }
  }

  componentDidMount() {
    kaleidoscope.prepPage(this.props.src)
  }

  componentDidUpdate() {
    kaleidoscope.prepPage(this.props.src)
  }

  render() {
    const specs = this.props
    const size = specs.scopeSize
    const canvases = []

    for (let i = 0; i < canvasCount; i += 1) {
      canvases.push(
        <canvas
          key={`kaleidoscope${i}`}
          className="kaleidoscopeCanvas"
          height={size}
          width={size}
        />,
      )
    }
    return <div> {canvases} </div>
  }
}

class Widget extends React.Component {
  state = {
    audio: false,
    cameras: [],
    kaleidoscope,
  }

  componentDidMount() {
    kaleidoscope.cameraList.then(list => {
      this.setState({
        cameras: list,
      })
    })
  }

  move(e) {
    this.state.kaleidoscope.move(e.target.value, e.target.value)
  }

  moveToggle(e) {
    if (e.target.checked) {
      this.state.kaleidoscope.visualizeAudio()
      this.setState({
        audio: true,
      })
    } else {
      this.state.kaleidoscope.visualizeAudio(true)
      this.setState({
        audio: false,
        fullscreen: false,
      })
    }
  }

  changeCamera(event) {
    const camera = event.target.value

    kaleidoscope.prepVideo(camera)
    kaleidoscope.move(0, 0)
  }

  render() {
    const specs = this.props
    const size = specs.scopeSize

    return (
      <div className="controls">
        <form className="controls-wrapper">
          <label htmlFor="audio">Use Audio: </label>
          <input
            type="checkbox"
            name="audio"
            className=""
            defaultChecked={this.state.audio}
            onChange={this.moveToggle.bind(this)}
          />
          <label
            htmlFor="y-range"
            className={`static-range ${!this.state.audio ? 'show' : 'hidden'}`}
          >
            Manual:{' '}
          </label>
          <input
            type="range"
            min="0"
            max={size / 5}
            defaultValue="0"
            name="y-range"
            onChange={this.move.bind(this)}
            className={`static-range ${!this.state.audio ? 'show' : 'hidden'}`}
          />
          <label htmlFor="camera-list">Camera: </label>
          <select name="camera-list" onChange={this.changeCamera.bind(this)}>
            {this.state.cameras.map((c, i) => (
              // console.log(c);
              <option key={`camera_${i}`} value={i}>
                {' '}
                {c.label}{' '}
              </option>
            ))}
          </select>
        </form>{' '}
      </div>
    )
  }
}

export default class App extends React.Component {
  constructor() {
    super()
    this.resizeTimer
    this.state = {
      // kaleidoscope,
      src:
        'https://scontent-iad3-1.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/sh0.08/e35/12331649_749127051897387_1820437710_n.jpg',
      size: App.calculateWidth(),
    }
    kaleidoscope.scopeSize = this.state.size
    kaleidoscope.prepPage()
  }

  static calculateWidth() {
    let rowCount = 3

    canvasCount = 6
    if (window.outerWidth < 1160) {
      rowCount = 2
    }
    if (window.outerWidth < 600) {
      rowCount = 1
      canvasCount = 2
    }
    return 2 * Math.floor(window.innerWidth / rowCount / 2)
  }

  // componentDidUpdate() {
  //   window.addEventListener("resize", this.updateDimensions.bind(this))
  // }

  updateDimensions() {
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => {
      this.setState({
        size: App.calculateWidth(),
      })
      kaleidoscope.scopeSize = this.state.size
      kaleidoscope.prepPage()
    }, 500)
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this))
    kaleidoscope.prepVideo()
    kaleidoscope.move(0, 0)
  }

  render() {
    return (
      <div data-img-url="test" id="sckscope">
        <Widget scopeSize={kaleidoscope.scopeSize} src={this.state.src} />
        <CanvasKscope scopeSize={this.state.size} src={this.state.src} />
        <a href="http://joshhoegen.com">
          <img className="logo" src="./static/media/jh-logo-80.png" alt="Art by Josh Hoegen" />
        </a>
        <Header directions="&#8598 Hover over the top left corner to use controls. Check 'Use Audio' with your favorite song!" />
        <video id="video" height={this.state.size + 100} width={this.state.size + 100} autoPlay />
      </div>
    )
  }
}

CanvasKscope.propTypes = {
  src: PropTypes.string,
}
