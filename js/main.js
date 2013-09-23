jQuery(document).ready(function () {
    var context = typeof AudioContext == 'function' ?
	    new AudioContext() :
	    typeof webkitAudioContext == 'function' ?
	    new webkitAudioContext() : jQuery('.no-support').show().parents('body').find('#scForm').hide(),
        vac = {},
        audioCache = {},
        audioActive,
	audioOnDeck,
        audioCurrentTime = 0,
	buttonPlay = jQuery('input[name=play]'),
	buttonPause = jQuery('input[name=pause]'),
	buttonFullscreen = jQuery('input[name=fullscreen]'),
	canvasActive = 8,
	imageRefresh,
	kscope,
	playTimeout,
        playlistActive = false,
	scopeSize = 250,
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
	    for (var i = 0, len = jQuery.kScope.length; i < len; i++) {
		kscope = jQuery.kScope[i];
                drawKaleidoscope(kscope['ctx'], kscope['img'][0], x, y, scopeSize);
	    }
        },
        visualizeAudio = function (audioActive) {
	    var ch = new Uint8Array(vac[audioActive].ch.analyser.frequencyBinCount),
		average, x, y;
            vac[audioActive].javascriptNode.onaudioprocess = function () {
                vac[audioActive].ch.analyser.getByteFrequencyData(ch);
                average = vac[audioActive].getAverageVolume(ch);
                //x = Math.round(average > 60 ? (average * 2.5) : (average > 80 ? (average * 5) : average));
                x = average + (average + (average/2));
		y = x; // Split channels, use analyser2
                move(x, y);
            }
        },
        addNewImages = function (src, size, max) {
	    var timer;
	    size = size || scopeSize;
	    max = max || 8; 
            jQuery('#sckscope').remove();
            //https://www.google.com/search?q=js+imultiple+canvas+or+one+large+canvas&aq=f&oq=js+imultiple+canvas+or+one+large+canvas&aqs=chrome.0.57j0.13276j0&sourceid=chrome&ie=UTF-8
            //http://stackoverflow.com/questions/4020910/html5-multiple-canvas-on-a-single-page
            jQuery('body .wrapper form').after(function () {
                var html = '<div id="sckscope">';
                for (i = 0; i < max; i++) {
                    html += '<img class="body-kscope img_' + i + '" height="'+size+'" width="'+size+'" alt="kaleidoscope" src="' + src + '" style="position: absolute; left: -9999px; margin: 0px; padding: 0px" />';
                }
                html += '</div>';
                return html;
            });
            jQuery('body').css({
                background: 'url(' + src + ')',
		animation: 'none',
                '-ms-animation': 'none',
                '-moz-animation': 'none',
                '-webkit-animation': 'none'
	    });
	    loadNewKaleidoscope();
	    if(audioCache[audioActive].audioDuration > 20){
		imageRefresh = new Timer(function () {
		    addNewImages(audioCache[audioActive].image, scopeSize, canvasActive);
		}, parseInt(audioCache[audioActive].audioDuration/20)*1000);
	    }
        },
	playTrack = function (url, track) {
	    if (audioActive != url && typeof vac[audioActive] != 'undefined') {
		vac[audioActive].stopSound(1);
	    }
	    audioActive = url;
	    addNewImages(audioCache[url].image, scopeSize, canvasActive);
	    vac[url].playSound(audioCache[url].stream, 0, audioCache[url].audioDuration);
	    visualizeAudio(audioActive);
	    setLoadingMessage('Loading track from SoundCloud...');
	    jQuery('.track-info').html('<h3>' +
		track.user.username + '</h3><p><strong>' + track.title + '</strong> | ' +
		track.description + ' | <a href="' + track.permalink_url + '" target="_blank">Open on SoundCloud</a></p>');
	},
        playList = function (tracks) {
	    var trackCount = tracks;
	    playTimeout = 0;
	    jQuery.each(audioCache, function(url, track){
		if (audioCache[url].timer) {
		    audioCache[url].timer.pause();
		    delete audioCache[url].timer;
		}
	    });
            jQuery.each(tracks, function (i, track) {
		var url = track.permalink_url.replace('http://', 'https://'),
		    image = track.artwork_url ? track.artwork_url : track.user.avatar_url;
		if (track.duration < 999999) {
		    vac[url] = new VisualAudioContext(context, track.stream);
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
		jQuery('.track-info').hide();
		requestFullScreen(document.body, function(){
		    width = (jQuery('body').width()+(scopeSize)),
		    height = (jQuery('body').height()+(scopeSize*5)),
		    total = (height/125)+(width/125);
		    jQuery('body').addClass('fullscreen').find('.wrapper').css({
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
		jQuery('body').removeClass('fullscreen').find('.wrapper').attr('style', '');
		addNewImages(audioCache[audioActive].image, scopeSize, total);
		buttonFullscreen.data({on: false});
		jQuery('.track-info').slideDown();
	    }
	    canvasActive = total;
	},
	setLoadingMessage = function (message) {
	  var loadingHtml = jQuery('<div class="kMessages">'+message+'</div>');
	  jQuery('#sckscope').append(loadingHtml);
	  setTimeout(function(){
	    loadingHtml.fadeOut('slow').remove(); 
	  }, 5000);
	}

    jQuery(window).resize(function () {
	if ($('body.fullscreen').length) {
	    fullscreen();
	}
    });
    
    buttonPause.on('click', function (e) {
        if (typeof vac !== 'undefined' && audioCache) {
            vac[audioActive].stopSound();
            audioCurrentTime = vac[audioActive].currentTime();
            //vac = new VisualAudioContext(context);
            jQuery(this).hide();
            buttonPlay.show();
            jQuery.each(audioCache, function(url, track){
		if(audioCache[url].timer){
		    audioCache[url].timer.pause();   
		}
	    });
        }
    }).hide();
    
    buttonFullscreen.on('click', function (e) {
	fullscreen($(this).data('on'));
    }).data({on: false}).hide();

    buttonPlay.on('click', function (e) {
        var val = jQuery('input[name=scUrl]').val().replace("http://", "https://");
	buttonPlay.hide();
        buttonPause.show();
	buttonFullscreen.show();
        if (playlistActive == val || audioActive == val) {
	    jQuery.each(audioCache, function(url, track){
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
		    jQuery('.track-info').slideDown();
                    playList(playlist);
                });
            }
        }
    });
});