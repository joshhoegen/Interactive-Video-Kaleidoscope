if ( ! window.console ) console = { log: function(){} };
var init = function () {
  var context = new webkitAudioContext(),
    vac = new VisualAudioContext(context),
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
    visualizeAudio = function () {
      // when the javascript node is called
      // we use information from the analyzer node
      // to draw the volume
      // get the average for the first channel
      // (channel 2 = analyser2)
      // Let's push something up the stack!
      vac.javascriptNode.onaudioprocess = function () {
        var array = new Uint8Array(vac.ch.analyser.frequencyBinCount);
        vac.ch.analyser.getByteFrequencyData(array);
        var average = vac.getAverageVolume(array);
        var x = Math.round(average > 65 ? (average * 2) : (average > 90 ? (average * 3.4) : average));
        var y = Math.round(average > 50 ? (average * 1.8) : (average > 70 ? (average * 5) : average * 1.2));
        move(x, y); // x5 so wecan normalize 100 to 500
      }
    },
    addNewImages = function (src) {
      jQuery('#body-kscope-wrapper').remove();
      //https://www.google.com/search?q=js+imultiple+canvas+or+one+large+canvas&aq=f&oq=js+imultiple+canvas+or+one+large+canvas&aqs=chrome.0.57j0.13276j0&sourceid=chrome&ie=UTF-8
      //http://stackoverflow.com/questions/4020910/html5-multiple-canvas-on-a-single-page
      jQuery('body').append(function () {
          var max = 8; //Math.round(width/500);
          var html = '<div id="body-kscope-wrapper">';
          for (i = 0; i < max; i++) {
            html += '<img class="body-kscope img_' + i + '" height="250" width="250" alt="kaleidoscope" src="' + src + '" style="position: absolute; left: -9999px; margin: 0px; padding: 0px" />';
          }
          html += '</div>';
          return html;
        });
      loadNewKaleidoscope();
    }

    jQuery('input[name=sc-pause]').on('click', function (e) {
      if (typeof vac !== 'undefined' && jQuery.KSC.AudioCache) {
        vac.stopSound(audioCurrentTime);
        audioCurrentTime = vac.currentTime();
        vac = new VisualAudioContext(context);
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
      if (typeof jQuery.KSC.AudioCache[val] != 'undefined' && jQuery.KSC.Loaded == val) {
        vac.playSound(audioCurrentTime, jQuery.KSC.AudioCache[val].stream, audioDuration);
        visualizeAudio();
      } else {
        if (vac.javascriptNode.onaudioprocess) {
          vac.stopSound();
        }
        jQuery.KSC.Loaded = val;
        if(typeof jQuery.KSC.AudioCache[val] != 'undefined'){
          console.log('Current val is in audioCache');
          addNewImages(jQuery.KSC.AudioCache[val].image);
          vac.playSound(0, jQuery.KSC.AudioCache[val].stream, audioDuration);
          visualizeAudio();
        } else {
          console.log('New SC AJAX');
          // Uses SoundCloud API/SDK 
          SC.initialize({
              client_id: 'b2d19575a677c201c6d23c39e408927a'
            });
          SC.get('/resolve', {
              url: val
            }, function (track) {
              if(track.kind == 'track'){
                jQuery.KSC.AudioCache[val] = {'stream': track.stream_url + '?client_id=b2d19575a677c201c6d23c39e408927a', 'url':val, 'image':track.artwork_url.replace('large', 't500x500') + '?client_id=b2d19575a677c201c6d23c39e408927a'};
                // AudioDuration = track.duration;
                audioDuration = track.duration / 1000;
                // jQuery('#body-kscope-wrapper > .body-kscope').attr('src', track.artwork_url.replace('large','t500x500')+'?client_id=b2d19575a677c201c6d23c39e408927a');
                addNewImages(jQuery.KSC.AudioCache[val].image);
                jQuery('#body-kscope-wrapper').append('<div class="track-info"><h3>' +
                  track.user.username + '</h3><p><strong>' + track.title + '</strong> | ' +
                  track.description + ' | <a href="' + track.permalink_url + '">Open on SoundCloud</a></p></div>');
                vac.playSound(0, jQuery.KSC.AudioCache[val].stream, audioDuration);
                visualizeAudio();
              } else {
                setLoadingMessage('Please select a single track from SoundCloud. Try this: http://soundcloud.com/byutifu/nina-simone-dont-let-me-be');
              }
            });
          }
        }
      });
},
loadNewKaleidoscope = function () {
  //var bg = jQuery('body').css('background-image').replace('url(','').replace(')','');
  var success = false;
  var height, width;
  jQuery.kScope = [];
  setLoadingMessage('Loading track from SoundCloud...');
  jQuery('img[alt=kaleidoscope]').each(function (i) {
      img = jQuery(this);
      height = 250 //img.height()*2;
      width = 250 //img.width()*2;
      kScopeObj = {
        img: img,
        height: height,
        width: width,
        canvas: jQuery('<canvas id="kaleidoscope_' + i + '" class="kaleidoscope" width="' + height + '" height="' + height + '"></canvas>'),
        ctx: false,
        imgLoaded: true
      }
      kScopeObj.img.after(kScopeObj.canvas[0]).hide();
      kScopeObj.ctx = kScopeObj.canvas[0].getContext('2d');
      jQuery.kScope.push(kScopeObj);
      drawKaleidoscope(kScopeObj.ctx, kScopeObj.img[0], 100, 100, kScopeObj.height);

    });
  if (jQuery.kScope.length) {
    success = true;
  }
  return success;
},
drawKaleidoscope = function (ctx, img, imgX, imgY, mask) {
  try {
    var maskSide = !mask ? 300 : mask;
    var sqSide = maskSide / 2;
    var sqDiag = Math.sqrt(2 * sqSide * sqSide);
    var c = maskSide / 2;
    var centerSide = 0;
    if (img.height < img.width) {
      maskSide = Math.abs(img.height - sqDiag);
    } else {
      maskSide = Math.abs(img.width - sqDiag);
    }
    /*var processCanvas = function(){
        var count = 0;
        var sc.a = 1;
        var sc.b = 1;
        while(count < 8){
          ctx.save();
          if(count < 4){
            ctx.translate(c, c);
            ctx.rotate(-90 * (Math.PI / 180));
          } else {
            ctx.save();
            ctx.moveTo(c, c);
            ctx.lineTo(c - sqSide, c);
            ctx.lineTo(c - sqSide, c - sqSide);
            ctx.lineTo(c, c);
            ctx.clip();
            ctx.translate(c, c);
          }
          ctx.scale(sc.a, sc.b);
          ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
          ctx.restore();
          count++;
          processCanvas();
        }
       
      }*/
    ctx.clearRect(0, 0, maskSide, maskSide);
    //7 (1) 1
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(-90 * (Math.PI / 180));
    ctx.scale(-1, -1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
    //2 (4) 2
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(-90 * (Math.PI / 180));
    ctx.scale(1, -1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
    //3 (5) 3
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(-90 * (Math.PI / 180));
    ctx.scale(1, 1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
    //8 4
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(-90 * (Math.PI / 180));
    ctx.scale(-1, 1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
    //1 5
    ctx.save();
    ctx.moveTo(c, c);
    ctx.lineTo(c - sqSide, c);
    ctx.lineTo(c - sqSide, c - sqSide);
    ctx.lineTo(c, c);
    ctx.clip();
    ctx.translate(c, c);
    ctx.scale(-1, -1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
    //4 6
    ctx.save();
    ctx.moveTo(c, c);
    ctx.lineTo(c + sqSide, c - sqSide);
    ctx.lineTo(c + sqSide, c);
    ctx.lineTo(c, c);
    ctx.clip();
    ctx.translate(c, c);
    ctx.scale(1, -1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
    //5 7
    ctx.save();
    ctx.moveTo(c, c);
    ctx.lineTo(c + sqSide, c);
    ctx.lineTo(c + sqSide, c + sqSide);
    ctx.lineTo(c, c);
    ctx.clip();
    ctx.translate(c, c);
    ctx.scale(1, 1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
    //8 8
    ctx.save();
    ctx.moveTo(c, c);
    ctx.lineTo(c - sqSide, c + sqSide);
    ctx.lineTo(c - sqSide, c);
    ctx.lineTo(c, c);
    ctx.clip();
    ctx.translate(c, c);
    ctx.scale(-1, 1);
    ctx.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.restore();
  } catch (err) {
    jQuery('#currentImage').remove();
    img = '';
    setLoadingMessage('Drawing Error');
    jQuery('#loadingContainer').show();
    ctx.clearRect(0, 0, 300, 300);
  }
},
setLoadingMessage = function (message) {
  var loadingHtml = jQuery('<div class="kMessages">'+message+'</div>');
  jQuery('#body-kscope-wrapper').append(loadingHtml);
  setTimeout(function(){
    loadingHtml.fadeOut('slow').remove(); 
  }, 5000);
}

jQuery.KSC = {AudioCache: {}, Loaded: ''};
jQuery(document).ready(function () {
  init();
});