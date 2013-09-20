jQuery(document).ready(function () {
    var context = typeof AudioContext == 'function' ?
	    new AudioContext() :
	    typeof webkitAudioContext == 'function' ?
	    new webkitAudioContext() :
	    window.location = 'https://github.com/joshhoegen/sckscope',
        vac = {},
        audioCache = {},
        audioActive,
	audioOnDeck,
        audioCurrentTime = 0,
	playTimeout,
        playlistActive = false,
        move = function (x, y) {
            jQuery('canvas.kaleidoscope').each(function (index) {
                var offset = jQuery(this).offset();
                //Ref: drawKaleidoscope(ctx, img, imgX, imgY, mask)
                drawKaleidoscope(jQuery.kScope[index]['ctx'], jQuery.kScope[index]['img'][0], x, y, jQuery(this).width());
            });
        },
        visualizeAudio = function (audioActive) {
            vac[audioActive].javascriptNode.onaudioprocess = function () {
                var array = new Uint8Array(vac[audioActive].ch.analyser.frequencyBinCount);
                vac[audioActive].ch.analyser.getByteFrequencyData(array);
                var average = vac[audioActive].getAverageVolume(array);
                var x = Math.round(average > 60 ? (average * 2.5) : (average > 80 ? (average * 5) : average));
                var y = Math.round(average > 60 ? (average * 2.5) : (average > 80 ? (average * 5) : average));
                move(x, y); // x5 so wecan normalize 100 to 500
		
            }
        },
        addNewImages = function (src) {
            jQuery('#sckscope').remove();
            //https://www.google.com/search?q=js+imultiple+canvas+or+one+large+canvas&aq=f&oq=js+imultiple+canvas+or+one+large+canvas&aqs=chrome.0.57j0.13276j0&sourceid=chrome&ie=UTF-8
            //http://stackoverflow.com/questions/4020910/html5-multiple-canvas-on-a-single-page
            jQuery('body .wrapper').append(function () {
                var max = 8; //Math.round(width/500);
                var html = '<div id="sckscope">';
                for (i = 0; i < max; i++) {
                    html += '<img class="body-kscope img_' + i + '" height="250" width="250" alt="kaleidoscope" src="' + src + '" style="position: absolute; left: -9999px; margin: 0px; padding: 0px" />';
                }
                html += '</div>';
                return html;
            });
            jQuery('body').css({
                background: 'url(' + src + ')',
                animation: 'none',
                '-ms-animation': 'none',
                '-moz-animation': 'none',
                '-webkit-animation': 'none',

            })
            loadNewKaleidoscope();
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
	playTrack = function (url, track) {
	    if (audioActive != url && typeof vac[audioActive] != 'undefined') {
		vac[audioActive].stopSound(1);
	    }
	    audioActive = url;
	    addNewImages(audioCache[url].image);
	    vac[url].playSound(audioCache[url].stream, 0, audioCache[url].audioDuration);
	    visualizeAudio(audioActive);
	    jQuery('#sckscope').append('<div class="track-info"><h3>' +
		track.user.username + '</h3><p><strong>' + track.title + '</strong> | ' +
		track.description + ' | <a href="' + track.permalink_url + '" target="_blank">Open on SoundCloud</a></p></div>');
	},
        playList = function (tracks) {
	    playTimeout = 0;
	    jQuery.each(audioCache, function(url, track){
		if (audioCache[url].timer) {
		    audioCache[url].timer.pause();
		    delete audioCache[url].timer;
		}
	    });	
            jQuery.each(tracks, function (url, track) {
		vac[url] = new VisualAudioContext(context, audioCache[url].stream);
		audioCache[url].audioDuration = track.duration / 1000;
                audioCache[url].timer = new Timer(function () {
		    playTrack(url, track);
		}, playTimeout);
                playTimeout += track.duration;
            });
        }

    jQuery('input[name=sc-pause]').on('click', function (e) {
        if (typeof vac !== 'undefined' && audioCache) {
            vac[audioActive].stopSound();
            audioCurrentTime = vac[audioActive].currentTime();
            //vac = new VisualAudioContext(context);
            jQuery(this).hide();
            jQuery('input[name=sc-submit]').show();
            jQuery.each(audioCache, function(url, track){
		if(audioCache[url].timer){
		    audioCache[url].timer.pause();   
		}
	    });
        }
    }).hide();

    jQuery('input[name=sc-submit]').on('click', function (e) {
        var val = jQuery('input[name=urlSoundCloud]').val();
        jQuery(this).hide();
        jQuery('input[name=sc-pause]').show();
        // val has to go. see playlists
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
                addNewImages(audioCache[val].image);
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
                        audioCache[val] = {
                            'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a',
                            'url': val,
                            'image': track.artwork_url.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a',
                        };
                        playlist[val] = track;
                        playList(playlist);
                        // AudioDuration = track.duration;
                    } else if (track.kind == 'playlist') {
                        playlistActive = val;
                        $.each(track.tracks, function (i) {
                            var track = this;
                            audioCache[track.permalink_url] = {
                                'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a',
                                'url': track.permalink_url,
                                'image': track.artwork_url.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a'
                            };
                            playlist[track.permalink_url] = track;
                        });
                        playList(playlist);
                    } else {
                        setLoadingMessage('Please select a single track from SoundCloud. Try this: http://soundcloud.com/byutifu/nina-simone-dont-let-me-be');
                    }

                });
            }
        }
    });
});