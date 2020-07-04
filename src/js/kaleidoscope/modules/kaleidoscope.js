import LiveVideo from 'live-video'

import Kaleidoscope from './drawKaleidoscope'
import VisualAudioContext from './audio'

const app = {
  kScope: [],
  cameraList: LiveVideo.listCameras(),
  canvas: document.getElementsByClassName('kaleidoscopeCanvas'),
  bufferCanvas: document.createElement('canvas'),
  bufferContext() {
    return this.bufferCanvas.getContext('2d')
  },
  canvasActive: 1,
  rotate: null,
  audio: {},
  listener: null,
  scopeSize: 400,
  mediaStream: null,
  audioActive: null,
  vac: null,
  audioCache: {},
  video: null,
  Kaleidoscope: null,
  coords() {
    const coord = this.scopeSize / 4

    return [coord, coord]
  },

  preCanvas: document.createElement('canvas'),

  move(x, y) {
    for (let i = 0; i < this.canvas.length; i += 1) {
      const ctx = this.canvas[i].getContext('2d')
      const img = this.Kaleidoscope.drawKaleidoscope(x, y, this.rotate)

      ctx.drawImage(img, 0, 0)
    }
    this.coords = [x, y]
  },

  visualizeAudio(off) {
    const ch = new Uint8Array(this.vac.ch.analyser.frequencyBinCount)

    let x

    let y

    if (off) {
      this.vac.close()
      return
    }
    this.vac.resume()
    this.vac.javascriptNode.onaudioprocess = () => {
      this.vac.ch.analyser.getByteFrequencyData(ch)
      x = this.vac.getAverageVolume(ch) / 1.9 // < this.scopeSize ? average : (average * 2) + 100; //x = x < scopeSize ? x - 60 : scopeSize;
      // if we want to split channels, use analyser2
      y = x
      this.move(x, y)
    }
  },

  prepPage(src) {
    let i

    this.preCanvas.id = 'preCanvas'
    this.preCanvas.width = this.scopeSize
    this.preCanvas.height = this.scopeSize
    // this.preCanvas.style.cssText = 'display: none'
    this.canvas = this.canvas || document.getElementsByClassName('kaleidoscopeCanvas')
    document.body.appendChild(this.preCanvas)
    for (i = 0; i < this.canvas.length; i += 1) {
      this.kScope[i] = {
        img: src || '',
        height: this.scopeSize,
        width: this.scopeSize,
        canvas: this.canvas[i],
        ctx: this.canvas[i].getContext('2d'),
        imgLoaded: true,
      }
    }

    this.Kaleidoscope = new Kaleidoscope(
      this.preCanvas,
      this.scopeSize,
      this.bufferCanvas,
      this.bufferContext(),
      this.rotate,
    )

    this.move(this.coords[0], this.coords[1])
  },

  prepVideo(camera = 0) {
    window.URL = window.URL || window.webkitURL
    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia || navigator.msGetUserMedia;
    // const preImage = document.createElement("img");
    const canvas = this.preCanvas
    const ctx = canvas.getContext('2d')
    const center = this.scopeSize / 2
    const video = document.getElementById('video')
    const videoLive = new LiveVideo({ video, audio: true, camera })

    videoLive
      .play()
      .then(() => {
        video.muted = true
        const mediaStream = video.srcObject

        video.autoplay = true
        this.video = video
        this.audioActive = mediaStream
        this.mediaStream = mediaStream
        this.vac = new VisualAudioContext(mediaStream, mediaStream)

        this.snapshot(video, canvas, ctx, mediaStream, center)
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e)
      })
  },

  stopStream() {
    if (this.video) {
      this.video.pause()
      this.video.src = ''
      this.video.load()
    }
    if (this.mediaStream && this.mediaStream.stop) {
      this.mediaStream.stop()
    }
    this.mediaStream = null
  },

  snapshot(video, preCanvas, ctx, stream, center) {
    ctx.drawImage(video, 0, 0, center, center)
    this.move(this.coords[0], this.coords[1])
    window.requestAnimationFrame(() => {
      this.snapshot(video, preCanvas, ctx, stream, center)
    })
  },
}

export default app
