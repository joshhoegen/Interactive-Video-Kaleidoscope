window.module = window.module || {};
console.log(typeof(require));
require = typeof(require) == 'function' ? require : function(script) {
  return;
};
var drawKaleidoscope = require('./drawKaleidoscope');
var VisualAudioContext = require('./audio');

var app = {
  kScope: [],
  canvas: document.getElementsByClassName('kaleidoscopeCanvas'),
  canvasActive: 1,
  audio: {},
  listener: null,
  scopeSize: 400,
  mediaStream: {},
  audioActive: {},
  vac: {},
  audioCache: {},
  coords: function() {
    var coord = this.scopeSize/4
    return [coord, coord];
  },
  preCanvas: document.createElement('canvas'),
  move: function(x, y) {
    for(var i = 0; i < this.canvas.length; i++) {
      var img = drawKaleidoscope(app.canvas[i].getContext('2d'), app.preCanvas, x, y, app.scopeSize);
      app.canvas[i].getContext('2d').drawImage(img, 0, 0);
    }
    this.coords = [x, y];
  },
  visualizeAudio: function(off) {
    var limit = this.scopeSize / 2;
    var ch = new Uint8Array(this.vac.ch.analyser.frequencyBinCount);
    var x;
    var y;
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
    this.vac.javascriptNode.onaudioprocess = function(e) {
      app.vac.ch.analyser.getByteFrequencyData(ch);
      x = app.vac.getAverageVolume(ch) / 1.9; // < this.scopeSize ? average : (average * 2) + 100; //x = x < scopeSize ? x - 60 : scopeSize;
      // if you want to split channels, use analyser2
      y = x;
      app.move(x, y);
    }
  },
  prepPage: function(src) {
    this.preCanvas.id = 'preCanvas';
    this.preCanvas.width = this.scopeSize;
    this.preCanvas.height = this.scopeSize;
    this.preCanvas.style.cssText = 'display: none';
    document.body.appendChild(this.preCanvas);
    src = src || '';
    this.canvas = this.canvas || document.getElementsByClassName('kaleidoscopeCanvas');
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
  prepVideo: function() {
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
    var preImage = document.createElement('img');
    var canvas = this.preCanvas;
    var ctx = canvas.getContext('2d');
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: true,
        audio: true
      }, function(mediaStream) {
        var video = document.getElementById('video');
        video.muted = true;
        video.src = window.URL.createObjectURL(mediaStream);
        video.autoplay = true;
        app.audioActive = video.src;
        app.mediaStream = mediaStream;
        app.vac = new VisualAudioContext(app.audioActive, app.mediaStream);
        // For SoundCloud.
        // audioActive = video.src; // Switching audio source.
        // audioCache[audioActive] = {
        //  image: preImage.attr('src')
        // }
        app.snapshot(video, canvas, ctx, mediaStream);
        // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
        // See crbug.com/110938.
        video.onloadedmetadata = function(e) {
          console.log('videLoaded');
        };
      }, function(error) {
        console.log('Failed' + error);
      });
    } else {
      console.log('failed getUserMedia(). :( ');
      // Create a fallback to other video:
      // video.src = 'somevideo.webm';
    }

  },
  snapshot: function(video, preCanvas, ctx, stream) {
    var center = this.scopeSize / 2;
    ctx.drawImage(video, 0, 0, center, center);
    this.move(this.coords[0], this.coords[1]);
    setTimeout(function() {
      app.snapshot(video, preCanvas, ctx, stream);
    }, 10);
  }
};

module.exports = app;
