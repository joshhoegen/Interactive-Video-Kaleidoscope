import drawKaleidoscope from './drawKaleidoscope';
import VisualAudioContext from './audio';

const app = {
  kScope: [],
  canvas: document.getElementsByClassName('kaleidoscopeCanvas'),
  canvasActive: 1,
  audio: {},
  listener: null,
  scopeSize: 400,
  mediaStream: null,
  audioActive: null,
  vac: null,
  audioCache: {},
  video: null,
  coords() {
    const coord = this.scopeSize/4;
    return [coord, coord];
  },
  preCanvas: document.createElement('canvas'),
  move(x, y) {
    // console.log('move');
    for(let i = 0; i < this.canvas.length; i++) {
      const ctx = app.canvas[i].getContext('2d');
      const img = drawKaleidoscope(ctx, app.preCanvas, x, y, app.scopeSize);
      ctx.drawImage(img, 0, 0);
    }
    this.coords = [x, y];
  },
  visualizeAudio(off) {
    const limit = this.scopeSize / 2;
    const ch = new Uint8Array(this.vac.ch.analyser.frequencyBinCount);
    let x;
    let y;
    if(off){
      this.vac.close();
      return;
    }
    this.vac.resume();
    // For SoundCloud.
    // if (this.audioActive.indexOf('blob:http') === -1 && typeof this.audioCache[audioActive] == 'object' && this.audioCache[audioActive].audioDuration > 20) {
    //   if (typeof imageRefresh === 'object') {
    //     imageRefresh.pause();
    //   }
    //   imageRefresh = new Timer(function() {
    //     this.move(coords[0], coords[1]);
    //   }, parseInt(audioCache[app.audioActive].audioDuration / 4) * 1000);
    // }
    // Move this to audio.js
    this.vac.javascriptNode.onaudioprocess = e => {
      app.vac.ch.analyser.getByteFrequencyData(ch);
      x = app.vac.getAverageVolume(ch) / 1.9; // < this.scopeSize ? average : (average * 2) + 100; //x = x < scopeSize ? x - 60 : scopeSize;
      // if we want to split channels, use analyser2
      y = x;
      app.move(x, y);
    }
  },
  prepPage(src) {
    let i;
    src = src || '';
    this.preCanvas.id = 'preCanvas';
    this.preCanvas.width = this.scopeSize;
    this.preCanvas.height = this.scopeSize;
    this.preCanvas.style.cssText = 'display: none';
    this.canvas = this.canvas || document.getElementsByClassName('kaleidoscopeCanvas');
    document.body.appendChild(this.preCanvas);
    for (i = 0; i < this.canvas.length; i++) {
      this.kScope[i] = {
        img: src,
        height: this.scopeSize,
        width: this.scopeSize,
        canvas: this.canvas[i],
        ctx: this.canvas[i].getContext('2d'),
        imgLoaded: true
      }
    }

    this.move(this.coords[0], this.coords[1]);
  },
  prepVideo() {
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
    const preImage = document.createElement('img');
    const canvas = this.preCanvas;
    const ctx = canvas.getContext('2d');
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: true,
        audio: true
      }, mediaStream => {
        const video = document.getElementById('video');
        video.muted = true;
        video.src = window.URL.createObjectURL(mediaStream);
        video.autoplay = true;
        app.video = video;
        app.audioActive = video.src;
        app.mediaStream = mediaStream;
        app.vac = new VisualAudioContext(app.audioActive, app.mediaStream);
        // For SoundCloud.
        // audioActive = video.src; // Switching audio source.
        // audioCache[audioActive] = {
        //  image: preImage.attr('src')
        // }
        app.snapshot(video, canvas, ctx, mediaStream);
      }, error => {
        console.log(`Failed${error}`);
      });
    } else {
      console.log('failed getUserMedia(). :( ');
    }
  },
  stopStream() {
    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video.load();
    }
    if (this.mediaStream && this.mediaStream.stop) {
      this.mediaStream.stop();
    }
    this.mediaStream = null;
  },
  snapshot(video, preCanvas, ctx, stream) {
    const center = this.scopeSize / 2;
    ctx.drawImage(video, 0, 0, center, center);
    this.move(this.coords[0], this.coords[1]);

    window.requestAnimationFrame(() => {
      app.snapshot(video, preCanvas, ctx, stream);
    });
  }
};

export default app;
