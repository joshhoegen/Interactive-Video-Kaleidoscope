$(document).ready(function () {
    var context = typeof AudioContext !== 'undefined' ?
	    new AudioContext() :
	    typeof webkitAudioContext !== 'undefined' ?
	    new webkitAudioContext() : $('.no-support').show().parents('body').find('#scForm').hide(),
	ctx,
        vac = {},
	audioTag = $('audio'),
	source = audioTag.length ? context.createMediaElementSource(audioTag[0]) : false,
        audioCache = {},
        audioActive,
	audioOnDeck,
        audioCurrentTime = 0,
	buttonPlay = $('input[name=play]'),
	buttonPause = $('input[name=pause]'),
	buttonNext = $('input[name=next]'),
	buttonRandom = $('input[name=random]'),
	buttonFullscreen = $('input[name=fullscreen]'),
	canvasActive = 8,
	container = $('#sckscope'),
	imageRefresh,
	images = $('#sckscope img'),
	canvases = $('#sckscope canvas'),
	isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
	isIE = navigator.userAgent.toLowerCase().indexOf('microsoft') > -1,
	kscope,
	limit = 250,
	mediaStream,
	playTimeout,
        playlistActive = false,
	scopeSize = 250,
	video = $('video'),
	defaultTracks = ['https://soundcloud.com/byutifu/put-a-spell-on-you',
		  'https://soundcloud.com/trapmusic/thump-by-drezo-subset-remix',
		  'https://soundcloud.com/feedme/love-is-all-i-got',
		  'https://soundcloud.com/byutifu/sets/end-of-summer-love',
		  'https://soundcloud.com/griz/smash-the-funk-forthcoming',
		  'https://soundcloud.com/byutifu/sets/psychedelic-dub-n-roll',
		  'https://soundcloud.com/glitchhop/kontrol-freqz-by-krossbow',
		  'https://soundcloud.com/trapmusic/sky-hands-by-glockwize',
		  'https://soundcloud.com/skeewiff/skeewiff-theme-from-dave-allen',
		  'https://soundcloud.com/easy-star-records/ticklah-ft-tamar-kali-want-not'],
	defaultTrackRandom = function(str) {
	    var defaults = defaultTracks;
	    if (str) {
		delete defaults[str];
	    }
	    return defaults[Math.floor(Math.random()*defaults.length)];
	},
	defaultUrl = function (name) {
	    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	},
	defaultTrack = defaultUrl('song');
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
		average, x, y;
            vac[audioActive].javascriptNode.onaudioprocess = function (e) {
                vac[audioActive].ch.analyser.getByteFrequencyData(ch);
                average = vac[audioActive].getAverageVolume(ch);
                x = x < (limit/2.5)+20 ? average+20 : (average * 2)+100; //x = x < scopeSize ? x - 60 : scopeSize;
		y = x; // if you want to split channels, use analyser2
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
                if (typeof imageRefresh === 'object') {
		    imageRefresh.pause();
		}
		imageRefresh = new Timer(function () {
                    prepPage(src);
		    addNewImages(src, size, max);
                }, parseInt(audioCache[audioActive].audioDuration/4)*1000);
            } 
	  
        },
	// This is starting to get MESSY!
	playTrack = function (url, track) {
	    var nextTrack = audioCache[audioCache[url].next],
		random = defaultTrackRandom() == url ? defaultTrackRandom() : defaultTrackRandom();
	    prepPage(audioCache[url].image);
	    audioActive = url;
	    addNewImages(audioCache[url].image, scopeSize, canvasActive);
	    audioTag.attr('src', audioCache[url].stream);
	    vac[url] = new VisualAudioContext(context, track.stream, false, source);
	    if (isFirefox || isIE) {
		soundManager.destroySound('flashAudio');
		soundManager.createSound({
		    id: 'flashAudio',
		    url: audioCache[url].stream,
		  }).play({
		    whileplaying: function() {
			average = this.peakData.left;
			x = average < (limit/2) ? average * (limit+75) : (average * (limit+200));
			y = x; // if you want to split channels, use analyser2
			move(x, y);
		    }
		  });
    	    } else {
		audioTag[0].play();
		visualizeAudio(audioActive);
		buttonFullscreen.show();
	    }
	    setLoadingMessage('Loading track from SoundCloud...');
	    if (nextTrack) {
		buttonNext.show();
	    }
	    $('.track-info').html('<img src="'+audioCache[url].image+'" alt="Original SoundCloud Image" /><h3>' +
		track.user.username + '</h3><p><strong>' + track.title + '</strong> | ' +
		track.description + ' | <a href="' + track.permalink_url + '" target="_blank">Open on SoundCloud</a></p>');
	    audioTag.on('ended', function(){
		if (nextTrack) {
		    playTrack(nextTrack.url, nextTrack.track);
		} else {
		    buttonNext.hide();
		    //getSoundCloud(random);
		}
	    });
	},
        playList = function (tracks) {
	    var first;
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
		    audioCache[url] = {
			'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a',
			'url': url,
			'image': image.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a',
			'audioDuration': track.duration / 1000,
			'track': track,
			'next': false
		    };
		    if (typeof tracks[i+1] !== 'undefined') {
			audioCache[url].next = tracks[i+1].permalink_url.replace('http://', 'https://');
		    } 
		    if (i == 0) {
			first = audioCache[url];
		    }
		}
            });
	    playTrack(first.url, first.track);
        },
	requestFullScreen = function (element, callback) {
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
	    limit = 420;
	    var preImage = $('<img class="vid-img" src="/image/kaleidoscope.jpg" height="500" width="500" />'),
		preCanvas = $('<canvas class="vid-canvas" height="500" width="500"></canvas>');
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
		    if (isFirefox) {
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
	    addNewImages(img, scopeSize, canvasActive);
	    setTimeout(function(){
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
	    //if (src == '') {
                canvasAll = canvasAll.add(image);
            //} else {
            //    image.attr('src', src);
            //}
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
	},
	getSoundCloud = function (val) {
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

    $(window).resize(function () {
	if ($('body.fullscreen').length) {
	    fullscreen();
	}
    });
    
    $(window).keyup(function(e) {
	if (e.keyCode == 27) {
	    buttonFullscreen.click();
	}
    });
    
    buttonFullscreen.on('click', function (e) {
	fullscreen($(this).data('on'));
    }).data({on: false}).hide();
        
    $('#scForm').on('submit', function(e){
	e.preventDefault();
	buttonPlay.click();
    });
    buttonNext.on('click', function(){
    	audioTag.stop();
	playTrack(audioCache[audioCache[audioActive].next].url, audioCache[audioCache[audioActive].next].track);
    }).hide();
    buttonPlay.on('click', function (e) {
        var val = $('input[name=scUrl]').val().replace("http://", "https://");
	window.history.pushState({}, "Byutifu Presents: SCkscope! by Joshua Hoegen", '/?song='+val);
	buttonNext.hide();
	if (!audioTag[0].paused) {
	    audioTag[0].pause();
	}
	container.show();    
	if (typeof audioCache[val] != 'undefined') {
	    addNewImages(audioCache[val].image, scopeSize, canvasActive);
	    //vac[val].playSound(audioCache[val].stream, 0, audioCache[val].audioDuration);
	    playTrack(audioCache[val].url, audioCache[val].track);
	    visualizeAudio(audioActive);
	} else {
	    // Uses SoundCloud API/SDK
	    getSoundCloud(val);
	}
    });
    buttonRandom.on('click', function () {
	var track = $('input[name=scUrl]'),
	    trackVal = track.val();
	track.val(defaultTrackRandom(trackVal));
	setTimeout(function (){
	    audioTag.stop();
	    buttonPlay.click();
	}, 1000);
    });
    if (video.length) {
	prepVideo();
    } else {
	audioTag[0].volume = 0.95;
	if (defaultTrack) {
	    $('input[name=scUrl]').val(defaultTrack);
	} else {
	    $('input[name=scUrl]').val(defaultTrackRandom());
	}
	if (isFirefox) {
	    soundManager.setup({
		url: '/js/soundmanager/swf/'
	    });
	    soundManager.flashVersion = 9;
	    soundManager.useFlashBlock = false;
	    soundManager.useHighPerformance = true;
	    soundManager.flashLoadTimeout = 3000;
	    //soundManager.flashPollingInterval = 40;
	    soundManager.waitForWindowLoad = true;
	    soundManager.debugMode = true;
	    soundManager.flash9Options.usePeakData = true; 
	}
    }
    container.hide();
    prepPage();
});