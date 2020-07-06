/* eslint-disable react/jsx-no-bind */
import React from 'react'
import PropTypes from 'prop-types'

import kaleidoscope from './js/kaleidoscope/modules/kaleidoscope'
import Header from './js/jhHeader'

import './css/main.scss'

let canvasCount = 6

let recursionCount = 6

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
  constructor(props) {
    super(props)
    this.state = {
      audio: false,
      rotate: false,
      kaleidoscope,
    }
  }
  // state = {
  //   audio: false,
  //   kaleidoscope,
  // }

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

  rotateToggle(e) {
    const val = e.target.value

    if (val > 0) {
      // this.state.kaleidoscope.visualizeAudio()
      this.setState({
        rotate: val,
      })
      kaleidoscope.rotate = val
    } else {
      // this.state.kaleidoscope.visualizeAudio(true)
      this.setState({
        rotate: 0,
      })
      kaleidoscope.rotate = 0
    }
  }

  changeCount(e) {
    const val = e.target.value

    recursionCount = val
    this.props.handleCanvasCount(val)
  }

  render() {
    const specs = this.props
    const size = specs.scopeSize
    const recursionInput =
      window.outerWidth > 600 ? (
        <span className="reset-span">
          <label htmlFor="count-range" className="static-range">
            Recursion:{' '}
          </label>
          <input
            type="range"
            min="6"
            max="12"
            step="2"
            defaultValue={recursionCount}
            name="count-range"
            onChange={this.changeCount.bind(this)}
            className="static-range"
          />
        </span>
      ) : (
        ''
      )

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
          <label htmlFor="audio">Rotate: </label>
          <input
            type="range"
            min={0.0}
            max={0.01}
            step={0.0001}
            name="rotate"
            className=""
            defaultValue={0}
            onChange={this.rotateToggle.bind(this)}
          />
          {recursionInput}
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
        </form>{' '}
      </div>
    )
  }
}

export default class App extends React.Component {
  constructor() {
    super()
    this.resizeTimer = null
    this.state = {
      // kaleidoscope,
      src: 'https://live.staticflickr.com/7420/9125709547_0a1fb3235c_c.jpg',
      size: App.calculateWidth(),
      listenerFunc: this.updateDimensions.bind(this),
    }
    kaleidoscope.scopeSize = this.state.size
    kaleidoscope.prepPage()
  }

  static calculateWidth(count) {
    let activeCount = count || recursionCount

    let rowCount = activeCount / 2 || 3
    // if adding more, need to figure out a scale... eg. Greater than 12 need 2.5ish
    const multiplier = activeCount <= 12 ? 2 : 1.5

    if (window.outerWidth < 600) {
      rowCount = 1
      // recursionCount = 2
      activeCount = 2
    }

    canvasCount = activeCount * multiplier
    // The canvases are tweaked to handle a hairline mismatch with exact calculations,
    // Therefore, we add 1px
    return Math.ceil(2 * (window.innerWidth / rowCount / 2))
  }

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
    const ua = navigator.userAgent.toLowerCase()
    const is_safari = ua.indexOf('safari/') > -1 && ua.indexOf('chrome') < 0

    if (is_safari) {
      const video = document.getElementById('video')

      setTimeout(() => {
        video.play()
      }, 50)
    }
    window.addEventListener('resize', this.state.listenerFunc)
    kaleidoscope.prepVideo()
    kaleidoscope.move(0, 0)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.state.listenerFunc)
  }

  render() {
    return (
      <div data-img-url="test" id="sckscope">
        <Widget
          handleCanvasCount={this.updateDimensions.bind(this)}
          scopeSize={kaleidoscope.scopeSize}
          src={this.state.src}
        />
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
