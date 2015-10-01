var $ = require('jquery');
var drawKaleidoscope = require('./modules/kaleidoscope');

var app = {
    kScope: [],
    canvasActive: 1,
    listener: null,
    scopeSize: 500,
    img: '',
    coords: [0, 0],
    move: function (x, y) {
        $.each(this.kScope, function (i) {
            var img = drawKaleidoscope(document.getElementById('canvasCheck').getContext('2d'), document.getElementById('preImg'), x, y, 500);
            document.getElementById('canvasCheck').getContext('2d').drawImage(img, 0, 0);
        });
        this.coords = [x, y];
        console.log(this.kScope);
    },
    prepPage: function (src) {
        src = src || '';
        var canvas,
            CanvasKscope = document.getElementById('canvasCheck');
        for (i = 0; i < this.canvasActive; i++) {
            this.kScope[i] = {
                img: document.getElementById('preImg'),
                height: 500,
                width: 500,
                canvas: CanvasKscope,
                ctx: CanvasKscope.getContext('2d'),
                imgLoaded: true
            }
        }

        this.move(this.coords[0], this.coords[1]);
    },
    prepVideo: function () {
        window.URL = window.URL || window.webkitURL;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
        limit = 420;
        var preImage = document.createElement('img'); //$('<img class="vid-img" src="/image/kaleidoscope.jpg" height="500" width="500" />'),
            preCanvas = document.getElementById('preCanvas')//document.getElementById('canvasCheck'); //$('<canvas class="vid-canvas" height="500" width="500"></canvas>');
        var ctx = preCanvas.getContext('2d');
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: true
            }, function (mediaStream) {
                //console.log(mediaStream);
                var video = document.getElementById('video');

                console.log('app.prepVideo');
                console.log(video);

                video.src = window.URL.createObjectURL(mediaStream);
                video.autoplay = true;
                //audioActive = video.src;

                /*audioCache[audioActive] = {
                 image: preImage.attr('src')
                 }*/
                //container.show();
                app.snapshot(video, document.getElementById('preCanvas'), ctx, mediaStream);

                //vac[audioActive] = new VisualAudioContext(context, audioActive, mediaStream);
                //visualizeAudio(audioActive);
                // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
                // See crbug.com/110938.
                video.onloadedmetadata = function (e) {
                    console.log('videLoaded');
                };
            }, function (error) {
                console.log('Failed' + error);
            });
        } else {
            console.log('failed getUserMedia(). :( ');
            //video.src = 'somevideo.webm'; // fallback.
        }

    },
    snapshot: function (video, preCanvas, ctx, stream) {
        var img = preCanvas.toDataURL('image/webp'),
            preImg = document.getElementById('preImg');

        preImg.setAttribute('src', img);
        ctx.drawImage(video, 0, 0, 500, 500);
        this.prepPage(img);
        setTimeout(function () {
            app.snapshot(video, preCanvas, ctx, stream);
        }, 10);
    }
};

module.exports = app;
