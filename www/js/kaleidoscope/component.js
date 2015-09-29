/** @jsx React.DOM */
var React = require('react');
var Backbone = require('backbone');
var ReactBackbone = require('react.backbone');
var ReactCanvas = require('react-canvas');
var $ = require('jquery');

var Surface = ReactCanvas.Surface;
var drawKaleidoscope = require('./modules/kaleidoscope');

var app = {
        kScope: [],
        canvasActive: 1,
        listener: null,
        scopeSize: 500,
        img: '',
        move: function (x, y) {
            $.each(this.kScope, function (i) {
                drawKaleidoscope(this.ctx, document.getElementById('canvasCheck'), x, y, this.scopeSize);
                console.log(i + 'kScope[]');
            });
        },
        prepPage: function (src) {
            src = src || '';
            var canvas,
                CanvasKscope = document.getElementById('canvasCheck');;
            console.log(this);
            //canvasAll = React.createElement("image", {}, canvasAll); //canvasAll.add(image);
            //canvasAll = <canvas>{{CanvasKscope}}</canvas>;
            for (i = 0; i < this.canvasActive; i++) {
                //console.log('test');
                //canvasAll.add(CanvasKscope);
                //console.log(CanvasKscope);
                this.kScope[i] = {
                    img: document.getElementById('preImg'),
                    height: 500,
                    width: 500,
                    canvas: CanvasKscope,
                    ctx: CanvasKscope.getContext('2d'),
                    imgLoaded: true
                }
            }

            this.move(50, 50);

            console.log(ImageString);
            //React.render(<listener.ImageString src={src} />, document.getElementById('image-container'), this.move(50, 50));



            //this.listener.forceUpdate();
            //console.log(this.listener);

            //React.render(<ImageString scopeSize="500" src={src} />, document.getElementById('image-container'))

            /* if (container.children().length) {
             container.children().replaceWith(canvasAll);
             } else {
             container.html(canvasAll);
             }*/

            /*if (audioActive) {
             addNewImages(src, scopeSize, canvasActive);
             }
             if (staticImg) {
             images.attr('src', src);
             setTimeout(function () {
             move(189, 189);
             }, 3000);

             }
             canvases = $('#sckscope canvas');
             images = $('#sckscope img');*/
        },
    }
    preVideo = React.createClass({
        render: function () {
            return (
                <video width="0" height="0" autoplay></video>
            );
        }
    }),
    preImage = React.createClass({
        render: function () {
            return (
                <img className="vid-img" src="/image/kaleidoscope.jpg" height="500" width="500"/>
            )
        }
    }),
    preCanvas = React.createClass({
        render: function () {
            return (
                <canvas className="vid-canvas" height="500" width="500"></canvas>
            );
        }
    }),
    CanvasKscope = React.createClass({
        render: function () {
            var specs = this.props;
            var size = specs.scopeSize;
            var src = specs.src;
            return (
                <canvas id="canvasCheck"
                        className="kaleidoscope"
                        height={size}
                        width={size}></canvas>
            );
        }
    }),
    ImageString = React.createClass({
        render: function () {
            console.log(this.props);
            //style="position: absolute; left: -9999px; margin: 0px; padding: 0px"
            var specs = this.props;
            var size = specs.scopeSize;
            var src = specs.src;
            return (
                <img id="preImg"
                     className="body-kscope img"
                     height={size}
                     width={size}
                     src={src}
                     alt="kaleidoscope" />
            )
        }
    }),
    Kscope = React.createBackboneClass({
        newImage: function(e){
            this.props.src = e.target.value;
            this.state.app.prepPage(this.props.src);
            console.log(this.props.canvas);
        },
        componentWillMount: function() {
            this.state.app.listener = this;
        },
        getInitialState: function () {
            return {
                app: app
            }
        },
        componentDidMount: function () {
            //console.log(React.render(<this.CanvasKscope id="canvasCheck" />, document.getElementById('container'), this.prepPage()));
            //React.render(<this.CanvasKscope />, document.getElementById('sckscope'));
            console.log(this.state);
        },
        render: function () {
            console.log(this.state.app);
            var imgSrc = this.props.src || "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/11363716_134653433554276_1743669472_n.jpg";
            return (
                <div imgUrl="test"
                     id="sckscope">
                    HEY
                    <input onChange={this.newImage}
                           name="fieldImg"
                           defaultValue="https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/11363716_134653433554276_1743669472_n.jpg"
                        />
                    <div id="image-container">
                        <ImageString scopeSize="500" src={imgSrc} />
                    </div>
                    <CanvasKscope scopeSize="500" src={imgSrc} />
                </div>
            );
        }
    });

module.exports = Kscope;

/*prepVideo: function () {
 window.URL = window.URL || window.webkitURL;
 navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
 navigator.mozGetUserMedia || navigator.msGetUserMedia;
 limit = 420;
 var preImage = this.preImage(),
 preCanvas = this.preCanvas();
 ctx = preCanvas[0].getContext('2d')
 if (navigator.getUserMedia) {
 navigator.getUserMedia({
 video: true,
 audio: true
 }, function (mediaStream) {
 var video = preVideo(); //document.querySelector('video');

 video.src = window.URL.createObjectURL(mediaStream);
 audioActive = video.src;
 audioCache[audioActive] = {
 image: preImage.attr('src')
 }
 //container.show();
 if (isFirefox) {
 snapshotFf(video, preCanvas[0], ctx, mediaStream);
 } else {
 snapshot(video, preCanvas[0], ctx, mediaStream);
 //$('input[name=fullscreen]').show();
 }

 vac[audioActive] = new VisualAudioContext(context, audioActive, mediaStream);
 visualizeAudio(audioActive);
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
 var img = preCanvas.toDataURL('image/webp');
 ctx.drawImage(video, 0, 0, scopeSize, scopeSize);
 addNewImages(img, scopeSize, canvasActive);
 setTimeout(function () {
 snapshot(video, preCanvas, ctx, stream);
 }, 10);

 },
 move: function (x, y) {
 $.each(kScope, function (i) {
 drawKaleidoscope(this.ctx, images[0], x, y, scopeSize);
 });
 },*/