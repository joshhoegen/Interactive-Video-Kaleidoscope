window.module = window.module || {};
var drawKaleidoscope = function(ctx, img, imgX, imgY, mask) {
  try {
    var maskSide = !mask ? 300 : mask;
    var sqSide = maskSide / 2;
    var sqDiag = Math.sqrt(2 * sqSide * sqSide);
    var c = maskSide / 2;
    var centerSide = 0;
    var bufferCanvas = document.createElement('canvas');
    var bufferContext = bufferCanvas.getContext('2d');

    bufferCanvas.height = mask;
    bufferCanvas.width = mask;

    if (img.height < img.width) {
      maskSide = Math.abs(img.height - sqDiag);
    } else {
      maskSide = Math.abs(img.width - sqDiag);
    }

    var scales = ['-1, -1', '1, -1', '1, 1', '-1, 1'];
    var layerOne = function(scale) {
      bufferContext.save();
      bufferContext.translate(c, c);
      bufferContext.rotate(-90 * (Math.PI / 180));
      bufferContext.scale(scale[0], scale[1]);
      bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
      bufferContext.restore();
    }
    var loopLayers = function(func) {
      for (var i = 0; i < scales.length; i++) {
        var scale = scales[i].split(', ');
        func(scale, i);
      }
    }

    // TODO: Lookup matrix lib
    loopLayers(layerOne);

    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(0, c);
    bufferContext.lineTo(0, 0);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(-1, -1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();

    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(c + c, 0);
    bufferContext.lineTo(c + c, c);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(1, -1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();

    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(c + c, c);
    bufferContext.lineTo(c + c, c + sqSide);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(1, 1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();

    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(0, c + c);
    bufferContext.lineTo(0, c);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(-1, 1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();

    ctx.drawImage(bufferCanvas, 0, 0);

    return bufferCanvas;

  } catch (error) {
    console.log('Kaleidoscope failed.');
    console.log(error);
    console.log(ctx);
    console.log(img);
    console.log(imgX);
    console.log(imgY);
    console.log(mask);
    bufferContext.clearRect(0, 0, 300, 300);
  }
}

module.exports = drawKaleidoscope;
