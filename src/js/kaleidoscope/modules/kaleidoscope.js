import LiveVideo from 'live-video'

import Kaleidoscope from './drawKaleidoscope'
import VisualAudioContext from './audio'

const app = {
  kScope: [],
  cameraList: [],
  camera: 0,
  canvas: document.getElementsByClassName('kaleidoscopeCanvas'),
  bufferCanvas: document.createElement('canvas'),
  bufferContext() {
    return this.bufferCanvas.getContext('2d')
  },
  canvasActive: 1,
  rotate: null,
  recording: false,
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
      const { ctx } = this.kScope[i]
      const img = this.Kaleidoscope.drawKaleidoscope(x, y, this.rotate)

      ctx.drawImage(img, 0, 0)
      if (this.recording && i === 0) {
        ctx.fillText('@joshhoegen', 10, 10)
      }
    }
    this.coords = [x, y]
  },

  download(recordedChunks) {
    const blob = new Blob(recordedChunks, {
      type: 'video/mp4', // webm
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    a.download = 'joshhoegen-kaleidoscope.mp4'
    a.click()
    window.URL.revokeObjectURL(url)
    this.recording = false
    window.location.reload()
  },

  record() {
    this.recording = true
    const videoStream = this.canvas[0].captureStream(30)

    const mediaRecorder = new MediaRecorder(videoStream)

    let chunks = []

    mediaRecorder.ondataavailable = e => {
      chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      this.download(chunks)
      chunks = []
    }
    mediaRecorder.ondataavailable = e => {
      chunks.push(e.data)
    }

    mediaRecorder.start()
    setTimeout(() => {
      mediaRecorder.stop()
    }, 10 * 1000)
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

    this.cameraList = LiveVideo.listCameras()
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

  prepVideo(camera = 0, audioContext) {
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
        this.vac = new VisualAudioContext(mediaStream, audioContext)

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
