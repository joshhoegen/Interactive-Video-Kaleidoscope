jQuery(document).ready(function () {
    var context = new webkitAudioContext(),
        vac = {},
        audioCache = {},
        audioActive,
        audioCurrentTime = 0,
        audioDuration = 0,
        playlistActive = false,
        playlist = {},
	timerActive,
        move = function (x, y) {
            jQuery('canvas.kaleidoscope').each(function (index) {
                var offset = jQuery(this).offset();
                //Ref: drawKaleidoscope(ctx, img, imgX, imgY, mask)
                drawKaleidoscope(jQuery.kScope[index]['ctx'], jQuery.kScope[index]['img'][0], x, y, jQuery(this).width());
            });
        },
        // Deprecated. Potentially useful.
        autoMove = function () {
            var rev = false;
            var i = 1;
            setTimeout(function () {
                move(i, i);
                if (!rev) {
                    i++;
                    rev = i == 498 ? true : false;
                } else {
                    i--;
                    rev = i == 1 ? false : true;
                }
            }, 30);
        },
        visualizeAudio = function (audioActive) {
            // when the javascript node is called
            // we use information from the analyzer node
            // to draw the volume
            // get the average for the first channel
            // (channel 2 = analyser2)
            // Let's push something up the stack!
            vac[audioActive].javascriptNode.onaudioprocess = function () {
                var array = new Uint8Array(vac[audioActive].ch.analyser.frequencyBinCount);
                vac[audioActive].ch.analyser.getByteFrequencyData(array);
                var average = vac[audioActive].getAverageVolume(array);
                var x = Math.round(average > 65 ? (average * 1) : (average > 90 ? (average * 3.4) : average));
                var y = Math.round(average > 50 ? (average * 1.8) : (average > 70 ? (average * 5) : average));
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
	
	    this.pause = function() {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
		console.log('paused');
	    };
	
	    this.resume = function() {
		start = new Date();
		timerId = window.setTimeout(callback, remaining);
	    };
	
	    this.resume();
	},
        playTrack = function (tracks) {
            /*if (typeof vac[url] != 'undefined' && vac[url].javascriptNode.onaudioprocess) {
                vac[url].stopSound(1);
            }*/
	    playTimeout = 0;
            jQuery.each(tracks, function (url, track) {
                timerActive = new Timer(function () {
                    vac[url] = new VisualAudioContext(context, audioCache[url].stream);
		    audioActive = url;
		    audioDuration = track.duration / 1000;
		    addNewImages(audioCache[url].image);
		    jQuery('#sckscope').append('<div class="track-info"><h3>' +
			track.user.username + '</h3><p><strong>' + track.title + '</strong> | ' +
			track.description + ' | <a href="' + track.permalink_url + '" target="_blank">Open on SoundCloud</a></p></div>');
		    vac[url].playSound(audioCache[url].stream, 0, audioDuration);
		    visualizeAudio(audioActive);
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
	    timerActive.pause();
        }
    }).hide();

    jQuery('input[name=sc-submit]').on('click', function (e) {
        var val = jQuery('input[name=urlSoundCloud]').val();
        jQuery(this).hide();
        jQuery('input[name=sc-pause]').show();
        // val has to go. see playlists
        if (playlistActive == val || audioActive == val) {
	    timerActive.resume;
            vac[audioActive].playSound(audioCache[audioActive].stream, audioCurrentTime, audioDuration);
            visualizeAudio(audioActive);
        } else {
            if (typeof audioCache[val] != 'undefined') {
                addNewImages(audioCache[val].image);
                vac[val].playSound(audioCache[val].stream, 0, audioDuration);
                visualizeAudio(audioActive);
            } else {
                // Uses SoundCloud API/SDK 
                SC.initialize({
                    client_id: 'b2d19575a677c201c6d23c39e408927a'
                });
                SC.get('/resolve', {
                    url: val
                }, function (track) {
                    playlistActive = false;
                    if (track.kind == 'track') {
                        audioCache[val] = {
                            'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a',
                            'url': val,
                            'image': track.artwork_url.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a'
                        };
                        playlist[val] = track;
			playTrack(playlist);
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
			playTrack(playlist);
                    } else {
                        setLoadingMessage('Please select a single track from SoundCloud. Try this: http://soundcloud.com/byutifu/nina-simone-dont-let-me-be');
                    }

                });
            }
        }
    });
});