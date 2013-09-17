jQuery(document).ready(function () {
    var context = new webkitAudioContext(),
	vac = {},
	audioCache = {},
	audioActive,
        audioCurrentTime = 0,
        audioDuration = 0,
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
                var x = Math.round(average > 65 ? (average * 2) : (average > 90 ? (average * 3.4) : average));
                var y = Math.round(average > 50 ? (average * 1.8) : (average > 70 ? (average * 5) : average * 1.2));
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
        }

    jQuery('input[name=sc-pause]').on('click', function (e) {
        if (typeof vac !== 'undefined' && audioCache) {
            vac[audioActive].stopSound(audioCurrentTime);
            audioCurrentTime = vac[audioActive].currentTime();
            //vac = new VisualAudioContext(context);
            jQuery(this).hide();
            jQuery('input[name=sc-submit]').show();
        }
    }).hide();

    jQuery('input[name=sc-submit]').on('click', function (e) {
        var val = jQuery('input[name=urlSoundCloud]').val();
        // AudioCache[val] = {'url': val};
        // Only make the SC.get happen once-ish
        // See audio.js:88 for future implementation of start from (pause effect)
        jQuery(this).hide();
        jQuery('input[name=sc-pause]').show();
        if (typeof audioCache[val] != 'undefined' && audioActive == val) {
            vac[val].playSound(audioCache[val].stream, audioCurrentTime, audioDuration);
            visualizeAudio(audioActive);
        } else {
            if (typeof vac[audioActive] != 'undefined') {
                vac[audioActive].stopSound();
            }
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
                    //console.log(track);
                    if (track.kind == 'track') {
                        audioCache[val] = {
                            'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a',
                            'url': val,
                            'image': track.artwork_url.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a'
                        };
                        // AudioDuration = track.duration;
                    } else if (track.kind == 'playlist') {
                        $.each(track.tracks, function (i) {
                            var track = this;
                            audioCache[val] = {
                                'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a',
                                'url': val,
                                'image': track.artwork_url.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a'
                            };
                        });
                        track = track.tracks[0];
                    } else {
                        setLoadingMessage('Please select a single track from SoundCloud. Try this: http://soundcloud.com/byutifu/nina-simone-dont-let-me-be');
                    }
		    vac[val] = new VisualAudioContext(context, audioCache[val].stream);
		    audioActive = val;
                    audioDuration = track.duration / 1000;
                    // jQuery('#sckscope > .body-kscope').attr('src', track.artwork_url.replace('large','t500x500')+'?client_id=b2d19575a677c201c6d23c39e408927a');
                    addNewImages(audioCache[val].image);
                    jQuery('#sckscope').append('<div class="track-info"><h3>' +
                        track.user.username + '</h3><p><strong>' + track.title + '</strong> | ' +
                        track.description + ' | <a href="' + track.permalink_url + '" target="_blank">Open on SoundCloud</a></p></div>');
                    vac[val].playSound(audioCache[val].stream, 0, audioDuration);
                    visualizeAudio(audioActive);
                });
            }
        }
    });
});