drawKaleidoscope = function (ctx, img, imgX, imgY, mask) {
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

    //bufferContext.clearRect(0, 0, maskSide, maskSide);
    //7 (1) 1
    bufferContext.save();
    bufferContext.translate(c, c);
    bufferContext.rotate(-90 * (Math.PI / 180));
    bufferContext.scale(-1, -1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();
    //2 (4) 2
    bufferContext.save();
    bufferContext.translate(c, c);
    bufferContext.rotate(-90 * (Math.PI / 180));
    bufferContext.scale(1, -1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();
    //3 (5) 3
    bufferContext.save();
    bufferContext.translate(c, c);
    bufferContext.rotate(-90 * (Math.PI / 180));
    bufferContext.scale(1, 1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();
    //8 4
    bufferContext.save();
    bufferContext.translate(c, c);
    bufferContext.rotate(-90 * (Math.PI / 180));
    bufferContext.scale(-1, 1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();
    //1 5
    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(c - sqSide, c);
    bufferContext.lineTo(c - sqSide, c - sqSide);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(-1, -1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    ctx.drawImage(bufferCanvas, 0, 0);
    bufferContext.restore();
    //4 6
    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(c + sqSide, c - sqSide);
    bufferContext.lineTo(c + sqSide, c);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(1, -1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();
    //5 7
    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(c + sqSide, c);
    bufferContext.lineTo(c + sqSide, c + sqSide);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(1, 1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();
    //8 8
    bufferContext.save();
    bufferContext.moveTo(c, c);
    bufferContext.lineTo(c - sqSide, c + sqSide);
    bufferContext.lineTo(c - sqSide, c);
    bufferContext.lineTo(c, c);
    bufferContext.clip();
    bufferContext.translate(c, c);
    bufferContext.scale(-1, 1);
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, sqSide, sqSide);
    bufferContext.restore();
    ctx.drawImage(bufferCanvas, 0, 0);
  } catch (err) {
    $('#currentImage').remove();
    img = '';
    $('#loadingContainer').show();
    bufferContext.clearRect(0, 0, 300, 300);
  }
}
