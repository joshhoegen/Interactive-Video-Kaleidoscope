if ( ! window.console ) console = { log: function(){} };
loadNewKaleidoscope = function () {
  //var bg = jQuery('body').css('background-image').replace('url(','').replace(')','');
  var success = false;
  var height, width;
  jQuery.kScope = [];
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
    jQuery('#loadingContainer').show();
    ctx.clearRect(0, 0, 300, 300);
  }
}

jQuery.KSC = {AudioCache: {}, Loaded: ''};
jQuery(document).ready(function () {
  var defaultUrl = function(name){
          var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
          return results ? results[1] : 0;
      },
      scUrl = defaultUrl('scUrl');
      
  if (scUrl !== 0) {
    jQuery('input[name=urlSoundCloud]').val(scUrl);
    setTimeout(function(){
      jQuery('input[name=sc-submit]').click();
    }, 2000);
  }
});