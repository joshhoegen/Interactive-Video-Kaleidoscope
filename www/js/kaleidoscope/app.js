var $ = require('jquery');
var drawKaleidoscope = require('./modules/kaleidoscope');
var VisualAudioContext = require('./modules/audio');

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
    $.each(this.canvas, function(i) {
      var img = drawKaleidoscope(app.canvas[i].getContext('2d'), app.preCanvas, x, y, app.scopeSize);
      app.canvas[i].getContext('2d').drawImage(img, 0, 0);
    });
    this.coords = [x, y];
  },
  visualizeAudio: function(off) {
    var limit = this.scopeSize / 2;
    var ch = new Uint8Array(this.vac.ch.analyser.frequencyBinCount),
      average, x, y;
    if(off){
      this.vac.close();
      //this.vac = null;
      console.log('off')
      return;
    }
    this.vac.resume();
    // if (this.audioActive.indexOf('blob:http') === -1 && typeof this.audioCache[audioActive] == 'object' && this.audioCache[audioActive].audioDuration > 20) {
    //   if (typeof imageRefresh === 'object') {
    //     imageRefresh.pause();
    //   }
    //   imageRefresh = new Timer(function() {
    //     this.move(coords[0], coords[1]);
    //   }, parseInt(audioCache[app.audioActive].audioDuration / 4) * 1000);
    // }
    this.vac.javascriptNode.onaudioprocess = function(e) {
      app.vac.ch.analyser.getByteFrequencyData(ch);
      var average = app.vac.getAverageVolume(ch);
      x = average / 1.9; // < this.scopeSize ? average : (average * 2) + 100; //x = x < scopeSize ? x - 60 : scopeSize;
      y = x; // if you want to split channels, use analyser2
      app.move(x, y);
      console.log(average);
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
    var preImage = document.createElement('img'); //$('<img class="vid-img" src="/image/kaleidoscope.jpg" height="this.scopeSize" width="this.scopeSize" />'),
    canvas = this.preCanvas; //this.canvas; //$('<canvas class="vid-canvas" height="this.scopeSize" width="this.scopeSize"></canvas>');
    // Making sure we don't keep calling getContext in the loop
    var ctx = canvas.getContext('2d');
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: true,
        audio: true
      }, function(mediaStream) {
        //console.log(mediaStream);
        var video = document.getElementById('video');
        video.muted = true;
        video.src = window.URL.createObjectURL(mediaStream);
        video.autoplay = true;
        app.audioActive = video.src;
        app.mediaStream = mediaStream;
        app.vac = new VisualAudioContext(app.audioActive, app.mediaStream);


        //audioActive = video.src;

        /*audioCache[audioActive] = {
         image: preImage.attr('src')
         }*/
        //container.show();
        app.snapshot(video, canvas, ctx, mediaStream);

        //vac[audioActive] = new VisualAudioContext(context, audioActive, mediaStream);
        //visualizeAudio(audioActive);
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
      //video.src = 'somevideo.webm'; // fallback.
    }

  },
  snapshot: function(video, preCanvas, ctx, stream) {
    //var img = preCanvas.toDataURL('image/webp');
    var center = this.scopeSize / 2;
    //this.preCanvas.setAttribute('src', img);
    ctx.drawImage(video, 0, 0, center, center);
    this.move(this.coords[0], this.coords[1]);
    setTimeout(function() {
      app.snapshot(video, preCanvas, ctx, stream);
    }, 10);
  }
};

module.exports = app;
