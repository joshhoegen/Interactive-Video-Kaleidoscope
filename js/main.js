$(document).ready(function () {
    var context = typeof AudioContext == 'function' ?
	    new AudioContext() :
	    typeof webkitAudioContext == 'function' ?
	    new webkitAudioContext() : $('.no-support').show().parents('body').find('#scForm').hide(),
	ctx,
        vac = {},
        audioCache = {},
        audioActive,
	audioOnDeck,
        audioCurrentTime = 0,
	buttonPlay = $('input[name=play]'),
	buttonPause = $('input[name=pause]'),
	buttonFullscreen = $('input[name=fullscreen]'),
	canvasActive = 8,
	container = $('#sckscope'),
	imageRefresh,
	images = $('#sckscope img'),
	canvases = $('#sckscope canvas'),
	kscope,
	limit = 250,
	mediaStream,
	playTimeout,
        playlistActive = false,
	scopeSize = 250,
	video = $('video'),
	defaultUrl = function(){
	    var results = new RegExp('[\\?&]scUrl=([^&#]*)').exec(window.location.href);
	    return results ? results[1] : 0;
	},
	Timer = function (callback, delay) {
            var timerId, start, remaining = delay;
            this.pause = function () {
                window.clearTimeout(timerId);
                remaining -= new Date() - start;
            };
            this.resume = function (time) {
		time = time || remaining;
                start = new Date();
                timerId = window.setTimeout(callback, remaining);
            };
            this.resume();
        },
        move = function (x, y) {
	    $.each($.kScope, function(i){
		kscope = $.kScope[i];
                drawKaleidoscope(kscope['ctx'], images[0], x, y, scopeSize);
	    });
        },
        visualizeAudio = function (audioActive) {
	    var ch = new Uint8Array(vac[audioActive].ch.analyser.frequencyBinCount),
		average, x, y, count = 0;
	    
            vac[audioActive].javascriptNode.onaudioprocess = function (e) {
		count++;
		
                vac[audioActive].ch.analyser.getByteFrequencyData(ch);
		
                average = vac[audioActive].getAverageVolume(ch);
                x = average + (average + (average/2));
		x = x < scopeSize ? x : scopeSize;

		//x = x < scopeSize * 2 ? x : scopeSize;
		y = x; // Split channels, use analyser2
                move(x, y);
            }
        },
        addNewImages = function (src, size, max) {
	    var timer;
	    size = size || scopeSize;
	    max = max || 8;
            //https://www.google.com/search?q=js+imultiple+canvas+or+one+large+canvas&aq=f&oq=js+imultiple+canvas+or+one+large+canvas&aqs=chrome.0.57j0.13276j0&sourceid=chrome&ie=UTF-8
            //http://stackoverflow.com/questions/4020910/html5-multiple-canvas-on-a-single-page
	    images.attr('src', src);
	    if(audioActive.indexOf('blob:http') === -1 && typeof audioCache[audioActive] == 'object' && audioCache[audioActive].audioDuration > 20){
                imageRefresh = new Timer(function () {
                    prepPage(src);
		    addNewImages(src, size, max);
                }, parseInt(audioCache[audioActive].audioDuration/20)*1000);
            } 
	  
        },
	playTrack = function (url, track) {
	    if (audioActive != url && typeof vac[audioActive] != 'undefined') {
		vac[audioActive].stopSound(1);
	    }
	    prepPage();
	    audioActive = url;
	    addNewImages(audioCache[url].image, scopeSize, canvasActive);
	    vac[url].playSound(audioCache[url].stream, 0, audioCache[url].audioDuration);
	    visualizeAudio(audioActive);
	    setLoadingMessage('Loading track from SoundCloud...');
	    $('.track-info').html('<h3>' +
		track.user.username + '</h3><p><strong>' + track.title + '</strong> | ' +
		track.description + ' | <a href="' + track.permalink_url + '" target="_blank">Open on SoundCloud</a></p>');
	},
        playList = function (tracks) {
	    var trackCount = tracks;
	    playTimeout = 0;
	    $.each(audioCache, function(url, track){
		if (audioCache[url].timer) {
		    audioCache[url].timer.pause();
		    delete audioCache[url].timer;
		}
	    });
            $.each(tracks, function (i, track) {
		var url = track.permalink_url.replace('http://', 'https://'),
		    image = track.artwork_url ? track.artwork_url : track.user.avatar_url;
		if (track.duration < 999999) {
		    vac[url] = new VisualAudioContext(context, track.stream, false);
		    audioCache[url] = {
			'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a',
			'url': track.permalink_url,
			'image': image.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a',
			'audioDuration': track.duration / 1000
		    };
		    audioCache[url].timer = new Timer(function () {
			playTrack(url, track);
		    }, playTimeout);
		    playTimeout += track.duration;
		}
            });
	    setTimeout(function(){
		buttonPause.hide();
		buttonPlay.show();
		buttonFullscreen.hide();
		imageRefresh.pause();
		audioActive = false;
	    }, playTimeout);
        },
	requestFullScreen = function (element, callback) {
	    // Supports most browsers and their versions.
	    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
	    if (requestMethod) { // Native full screen.
		requestMethod.call(element);
	    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
		    wscript.SendKeys("{F11}");
		}
	    }
	    if (typeof callback != 'undefined') {
		callback();
	    }
	},
	fullscreen = function(full){
	    var on = full || false,
		width, height,
		total = 8;
	    if (!on) {
		$('.track-info').hide();
		requestFullScreen(document.body, function(){
		    width = ($('body').width()+(scopeSize)),
		    height = ($('body').height()+(scopeSize*5)),
		    total = (height/125)+(width/125);
		    $('body').addClass('fullscreen').find('.wrapper').css({
			width: (width) ,
			height: (height-scopeSize)
		    });
		    addNewImages(audioCache[audioActive].image, scopeSize, total);
		    buttonFullscreen.data({on: true});    
		});
	    } else {
		scopeSize = 250;
		limit = 250;
		if (document.cancelFullScreen) {
		    document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
		    document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
		    document.webkitCancelFullScreen();
		}
		$('body').removeClass('fullscreen').find('.wrapper').attr('style', '');
		addNewImages(audioCache[audioActive].image, scopeSize, total);
		buttonFullscreen.data({on: false});
		$('.track-info').slideDown();
	    }
	    canvasActive = total;
	    prepPage(audioCache[audioActive].image);
	},
	setLoadingMessage = function (message) {
	  var loadingHtml = $('<div class="kMessages">'+message+'</div>');
	  $('#sckscope').append(loadingHtml);
	  setTimeout(function(){
	    loadingHtml.fadeOut('slow').remove(); 
	  }, 5000);
	},
	prepVideo = function (){
	    window.URL = window.URL || window.webkitURL;
	    navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
				      navigator.mozGetUserMedia || navigator.msGetUserMedia;
	    var preImage = $('<img class="vid-img" src="/image/kaleidoscope.jpg" height="400" width="400" />'),
		preCanvas = $('<canvas class="vid-canvas" height="400" width="400"></canvas>');
		ctx = preCanvas[0].getContext('2d'),
		fail = function(){
		    console.log('Failed');
		}
	    if (navigator.getUserMedia) {
		navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
		    var video = document.querySelector('video');
		    
		    mediaStream = localMediaStream;
		    
		    video.src = window.URL.createObjectURL(mediaStream);
		    audioActive = video.src;
		    audioCache[audioActive] = {
			image: preImage.attr('src')
		    }
		    container.show();
		    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
			snapshotFf(video, preCanvas[0], ctx, mediaStream);
		    } else {
			snapshot(video, preCanvas[0], ctx, mediaStream);
			$('input[name=fullscreen]').show();
		    }
		    
		    vac[audioActive] = new VisualAudioContext(context, audioActive, mediaStream);
		    visualizeAudio(audioActive);
		    // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
		    // See crbug.com/110938.
		    video.onloadedmetadata = function(e) {
			// Ready to go. Do some stuff.
			console.log('videLoaded');
		    };
		}, fail);
	    } else {
	      console.log('failed getUserMedia(). :( ');
	      //video.src = 'somevideo.webm'; // fallback.
	    }
	    
	},
	snapshot = function (video, preCanvas, ctx, stream) {
	    var img = preCanvas.toDataURL('image/webp');
	    ctx.drawImage(video, 0, 0, scopeSize, scopeSize);
	    // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
	    //$('img').src = canvas.toDataURL('image/webp');
	    addNewImages(img, scopeSize, canvasActive);
	    setTimeout(function(){
		//prepPage(img);
		snapshot(video, preCanvas, ctx, stream);
	    }, 10);
	    
	},
	snapshotFf = function (video, preCanvas, ctx, stream) {
	    try {
		ctx.drawImage(video, 0, 0, scopeSize, scopeSize);
		addNewImages(preCanvas.toDataURL('image/png'), scopeSize, canvasActive);
		setTimeout(function(){
		    snapshotFf(video, preCanvas, ctx, stream);
		}, 30);
	    } catch(e){
		console.log(e);
		setTimeout(function(){
		    snapshotFf(video, preCanvas, ctx, stream);
		}, 10);
	    }
	    
	},
	prepPage = function (src) {
	    src = src || '';
	    var canvas, canvasAll = $(), canvasString, image;
	    image = $('<img class="body-kscope img" height="'+scopeSize+'" width="'+scopeSize+'" alt="kaleidoscope" src="'+src+'" style="position: absolute; left: -9999px; margin: 0px; padding: 0px" />');
	    if (src == '') {
		canvasAll = canvasAll.add(image);
	    } else {
		image.attr('src', src);
	    }
	    for (i = 0; i < canvasActive; i++) {
		canvasString = $('<canvas class="kaleidoscope" width="'+scopeSize+'" height="'+scopeSize+'"></canvas>');
		canvasAll = canvasAll.add(canvasString);
		$.kScope[i] = {
		    img: image,
		    height: scopeSize,
		    width: scopeSize,
		    canvas: canvasString,
		    ctx: canvasString[0].getContext('2d'),
		    imgLoaded: true
		}
	    }
	    container.html(canvasAll);
	    if (!canvases.length || !images.length) {
		canvases = $('#sckscope canvas');
		images = $('#sckscope img');
	    }
	}

    $(window).resize(function () {
	if ($('body.fullscreen').length) {
	    fullscreen();
	}
    });
    
    buttonPause.on('click', function (e) {
        if (typeof vac !== 'undefined' && audioCache) {
            vac[audioActive].stopSound();
            audioCurrentTime = vac[audioActive].currentTime();
            //vac = new VisualAudioContext(context);
            $(this).hide();
            buttonPlay.show();
            $.each(audioCache, function(url, track){
		if(audioCache[url].timer){
		    audioCache[url].timer.pause();   
		}
	    });
        }
    }).hide();
    
    buttonFullscreen.on('click', function (e) {
	fullscreen($(this).data('on'));
    }).data({on: false}).hide();
        
    $('#scForm').on('submit', function(e){
	e.preventDefault();
	buttonPlay.click();
    });
    buttonPlay.on('click', function (e) {
        var val = $('input[name=scUrl]').val().replace("http://", "https://");
	// toggle. make 1 button.
	buttonPlay.hide();
        buttonPause.show();
	buttonFullscreen.show();
	container.show();
        if (playlistActive == val || audioActive == val) {
	    $.each(audioCache, function(url, track){
		if(audioCache[url].timer){
		    audioCache[url].timer.resume();   
		}	
	    });
            vac[audioActive].playSound(audioCache[audioActive].stream, audioCurrentTime, audioCache[audioActive].audioDuration);
            visualizeAudio(audioActive);
        } else {
            if (typeof audioCache[val] != 'undefined') {
                addNewImages(audioCache[val].image, scopeSize, canvasActive);
                vac[val].playSound(audioCache[val].stream, 0, audioCache[val].audioDuration);
                visualizeAudio(audioActive);
            } else {
                // Uses SoundCloud API/SDK
                SC.initialize({
                    client_id: 'b2d19575a677c201c6d23c39e408927a'
                });
                SC.get('/resolve', {
                    url: val
                }, function (track) {
		    var playlist = {};
                    playlistActive = false;
                    if (track.kind == 'track') {
                        playlist[0] = track;
                    } else if (track.kind == 'playlist') {
                        playlistActive = val;
                        playlist = track.tracks;
                    } else {
                        setLoadingMessage('Please select a single track from SoundCloud. Try this: http://soundcloud.com/byutifu/nina-simone-dont-let-me-be');
		    }
		    $('.track-info').slideDown();
                    playList(playlist);
                });
            }
        }
    });
    var tracks = ['https://soundcloud.com/byutifu/put-a-spell-on-you',
		  'https://soundcloud.com/trapmusic/thump-by-drezo-subset-remix',
		  'https://soundcloud.com/feedme/love-is-all-i-got']
    if (video.length) {
	prepVideo();
    } else {
	$('input[name=scUrl]').val(tracks[Math.floor(Math.random()*tracks.length)]);
    }
    container.hide();
    prepPage();
});