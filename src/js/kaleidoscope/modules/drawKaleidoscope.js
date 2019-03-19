// TODO: Abstract bufferContext.drawImage() since it always uses the same vals

const drawKaleidoscope = function(ctx, img, imgX, imgY, mask, bCan, bCon) {
  const sqSide = mask / 2
  const sqDiag = Math.sqrt(2 * sqSide * sqSide)
  const c = mask / 2
  const centerSide = 0
  const bufferCanvas = bCan
  const bufferContext = bCon
  const maskSide = Math.abs(mask - sqDiag)

  bufferCanvas.height = mask
  bufferCanvas.width = mask

  bufferContext.save()
  bufferContext.translate(c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  bufferContext.scale(-1, -1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.translate(c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  bufferContext.scale(1, -1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.translate(c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  bufferContext.scale(1, 1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.translate(c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  bufferContext.scale(-1, 1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.translate(c, c)
  bufferContext.rotate(-90 * (Math.PI / 180))
  bufferContext.scale(-1, -1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(0, c)
  bufferContext.lineTo(0, 0)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(-1, -1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(c + c, 0)
  bufferContext.lineTo(c + c, c)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(1, -1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(c + c, c)
  bufferContext.lineTo(c + c, c + sqSide)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(1, 1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  bufferContext.save()
  bufferContext.moveTo(c, c)
  bufferContext.lineTo(0, c + c)
  bufferContext.lineTo(0, c)
  bufferContext.lineTo(c, c)
  bufferContext.clip()
  bufferContext.translate(c, c)
  bufferContext.scale(-1, 1)
  bufferContext.drawImage(
    img,
    imgX,
    imgY,
    maskSide,
    maskSide,
    centerSide,
    centerSide,
    sqSide,
    sqSide,
  )
  bufferContext.restore()

  ctx.drawImage(bufferCanvas, 0, 0)

  return bufferCanvas
}

module.exports = drawKaleidoscope
