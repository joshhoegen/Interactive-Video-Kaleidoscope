/* eslint-disable react/jsx-no-bind */
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
  constructor(props) {
    super(props)
    this.state = {
      audio: false,
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

  changeCount(e) {
    this.props.handleCanvasCount(e.target.value)
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
          <label htmlFor="count-range" className="static-range">
            Recursion:{' '}
          </label>
          <input
            type="range"
            min="6"
            max="12"
            step="2"
            defaultValue={canvasCount}
            name="count-range"
            onChange={this.changeCount.bind(this)}
            className="static-range"
          />
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
      src: 'https://live.staticflickr.com/7420/9125709547_0a1fb3235c_c.jpg',
      size: App.calculateWidth(),
    }
    kaleidoscope.scopeSize = this.state.size
    kaleidoscope.prepPage()
  }

  static calculateWidth(count) {
    let rowCount = count / 2 || 3
    // if adding more, need to figure out a scale... eg. Greater than 12 need 2.5ish
    const multiplier = count <= 12 ? 2 : 1.5

    canvasCount = count * multiplier || 6
    // if (window.outerWidth < 1160) {
    //   rowCount = 2
    // }
    if (window.outerWidth < 600) {
      rowCount = 1
      canvasCount = 2
    }
    return 2 * Math.ceil(window.innerWidth / rowCount / 2)
  }

  // componentDidUpdate() {
  //   window.addEventListener('resize', this.updateDimensions.bind(this))
  // }

  updateDimensions(count) {
    // this.setState({ size: count })
    const finalCount = count || canvasCount

    console.log(count, canvasCount)

    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => {
      this.setState({
        size: App.calculateWidth(finalCount),
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
