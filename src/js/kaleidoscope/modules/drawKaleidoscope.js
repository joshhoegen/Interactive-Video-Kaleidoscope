/* eslint-disable func-names */
const drawKaleidoscope = function(ctx, img, imgX, imgY, mask, bCan, bCon, isRotate) {
  // TODO: USE: // bufferContext.setTransform(1, 0, 0, 1, 0, 0)
  const c = mask / 2
  const sqDiag = Math.sqrt(2 * c * c)
  const centerSide = 0
  const bufferCanvas = bCan
  const bufferContext = bCon
  const maskSide = Math.abs(mask - sqDiag)

  if (isRotate) {
    const rotateContext = img.getContext('2d')

    rotateContext.translate(c / 2, c / 2)
    rotateContext.rotate(isRotate)
    rotateContext.translate(-c / 2, -c / 2)
  }

  // console.log(Math.floor(((time / 10000) % 60) * 6))

  function drawImg() {
    // console.log(time)
    bufferContext.drawImage(img, imgX, imgY, maskSide, maskSide, centerSide, centerSide, c, c)
  }

  bufferCanvas.height = mask
  bufferCanvas.width = mask

  bufferContext.save()

  // console.log(bufferContext)

  bufferContext.setTransform(-1, 0, 0, -1, c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  // bufferContext.scale(-1, -1)
  drawImg()

  bufferContext.setTransform(1, 0, 0, -1, c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  // bufferContext.scale(1, -1)
  drawImg()

  bufferContext.setTransform(1, 0, 0, 1, c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  // bufferContext.scale(1, 1)
  drawImg()

  bufferContext.setTransform(-1, 0, 0, 1, c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  // bufferContext.scale(-1, 1)
  drawImg()

  bufferContext.setTransform(-1, 0, 0, -1, c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  // bufferContext.scale(-1, -1)
  drawImg()

  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(0, c)
  bufferContext.lineTo(0, 0)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(-1, -1)
  drawImg()
  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(c + c, 0)
  bufferContext.lineTo(c + c, c)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(1, -1)
  drawImg()
  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(c + c, c)
  bufferContext.lineTo(c + c, c + c)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(1, 1)
  drawImg()
  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(0, c + c)
  bufferContext.lineTo(0, c)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(-1, 1)
  drawImg()
  bufferContext.restore()

  // ctx.drawImage(bufferCanvas, 0, 0)

  // console.log(ctx.drawImage(bufferCanvas, 0, 0))

  return bufferCanvas
}

export default drawKaleidoscope
