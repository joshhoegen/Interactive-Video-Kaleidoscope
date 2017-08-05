var drawKaleidoscope = function(ctx, img, imgX, imgY, mask, bCan, bCon) {
  var sqSide = mask / 2;
  var sqDiag = Math.sqrt(2 * sqSide * sqSide);
  var c = mask / 2;
  var centerSide = 0;
  var bufferCanvas = bCan;
  var bufferContext = bCon;
  var maskSide = Math.abs(mask - sqDiag);

  bufferCanvas.height = mask;
  bufferCanvas.width = mask;

  bufferContext.save();
  bufferContext.translate(c, c);
  bufferContext.rotate(-90 * (Math.PI / 180));
  bufferContext.scale(-1, -1);
  bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
  bufferContext.restore();

  bufferContext.save();
  bufferContext.translate(c, c);
  bufferContext.rotate(-90 * (Math.PI / 180));
  bufferContext.scale(1, -1);
  bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
  bufferContext.restore();

  bufferContext.save();
  bufferContext.translate(c, c);
  bufferContext.rotate(-90 * (Math.PI / 180));
  bufferContext.scale(1, 1);
  bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
  bufferContext.restore();

  bufferContext.save();
  bufferContext.translate(c, c);
  bufferContext.rotate(-90 * (Math.PI / 180));
  bufferContext.scale(-1, 1);
  bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
  bufferContext.restore();

  bufferContext.save();
  bufferContext.translate(c, c);
  bufferContext.rotate(-90 * (Math.PI / 180));
  bufferContext.scale(-1, -1);
  bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
  bufferContext.restore();

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
}

module.exports = drawKaleidoscope;
