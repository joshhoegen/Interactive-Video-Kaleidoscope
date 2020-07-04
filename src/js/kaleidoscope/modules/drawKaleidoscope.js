export default class Kaleidoscope {
  constructor(img, mask, bCan, bCon) {
    this.img = img
    this.imgX = 0
    this.imgY = 0
    this.mask = mask
    this.c = this.mask / 2
    this.sqDiag = Math.sqrt(2 * this.c * this.c)
    this.centerSide = 0
    this.bufferCanvas = bCan
    this.bufferContext = bCon
    this.maskSide = Math.abs(this.mask - this.sqDiag)
    this.rotateContext = img.getContext('2d')
  }

  drawImg() {
    // console.log(time)
    this.bufferContext.drawImage(
      this.img,
      this.imgX,
      this.imgY,
      this.maskSide,
      this.maskSide,
      this.centerSide,
      this.centerSide,
      this.c,
      this.c,
    )
  }

  drawKaleidoscope(x, y, isRotate) {
    const { bufferCanvas, bufferContext, c } = this

    this.imgX = x
    this.imgY = y

    if (isRotate) {
      this.rotateContext.translate(this.c / 2, this.c / 2)
      this.rotateContext.rotate(isRotate)
      this.rotateContext.translate(-this.c / 2, -this.c / 2)
    }

    this.bufferCanvas.height = this.mask
    this.bufferCanvas.width = this.mask

    bufferContext.save()

    bufferContext.setTransform(-1, 0, 0, -1, c, c)
    bufferContext.rotate(-90 * (Math.PI / 180))
    // bufferContext.scale(-1, -1)
    this.drawImg()

    bufferContext.setTransform(1, 0, 0, -1, c, c)
    bufferContext.rotate(-90 * (Math.PI / 180))
    // bufferContext.scale(1, -1)
    this.drawImg()

    bufferContext.setTransform(1, 0, 0, 1, c, c)
    bufferContext.rotate(-90 * (Math.PI / 180))
    // bufferContext.scale(1, 1)
    this.drawImg()

    bufferContext.setTransform(-1, 0, 0, 1, c, c)
    bufferContext.rotate(-90 * (Math.PI / 180))
    // bufferContext.scale(-1, 1)
    this.drawImg()

    bufferContext.setTransform(-1, 0, 0, -1, c, c)
    bufferContext.rotate(-90 * (Math.PI / 180))
    // bufferContext.scale(-1, -1)
    this.drawImg()

    bufferContext.restore()

    bufferContext.save()
    bufferContext.moveTo(c, c)
    bufferContext.lineTo(0, c)
    bufferContext.lineTo(0, 0)
    bufferContext.lineTo(c, c)
    bufferContext.clip()
    // bufferContext.translate(c, c)
    // bufferContext.scale(-1, -1)
    bufferContext.setTransform(-1, 0, 0, -1, c, c)
    this.drawImg()
    bufferContext.restore()

    bufferContext.save()
    bufferContext.moveTo(c, c)
    bufferContext.lineTo(c + c, 0)
    bufferContext.lineTo(c + c, c)
    bufferContext.lineTo(c, c)
    bufferContext.clip()
    // bufferContext.translate(c, c)
    // bufferContext.scale(1, -1)
    bufferContext.setTransform(1, 0, 0, -1, c, c)
    this.drawImg()
    bufferContext.restore()

    bufferContext.save()
    bufferContext.moveTo(c, c)
    bufferContext.lineTo(c + c, c)
    bufferContext.lineTo(c + c, c + c)
    bufferContext.lineTo(c, c)
    bufferContext.clip()
    // bufferContext.translate(c, c)
    // bufferContext.scale(1, 1)
    bufferContext.setTransform(1, 0, 0, 1, c, c)
    this.drawImg()
    bufferContext.restore()

    bufferContext.save()
    bufferContext.moveTo(c, c)
    bufferContext.lineTo(0, c + c)
    bufferContext.lineTo(0, c)
    bufferContext.lineTo(c, c)
    bufferContext.clip()
    // bufferContext.translate(c, c)
    // bufferContext.scale(-1, 1)
    bufferContext.setTransform(-1, 0, 0, 1, c, c)
    this.drawImg()
    bufferContext.restore()

    return bufferCanvas
  }
}
