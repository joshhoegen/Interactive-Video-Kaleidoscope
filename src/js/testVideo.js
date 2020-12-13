const LiveVideo = class {
  /**
   * Return chosen camera. Return default true value if only one exists
   * @param {Object} props - Holds params to start live-video.
   * @param {Element} props.video - A video element.
   * @param {bool} props.audio - Use audio?
   * @param {Number} props.camera - Which camera to use.
   */
  constructor(props) {
    const params = Object.assign(
      {
        audio: true,
        camera: 0,
      },
      props,
    )

    Object.assign(this, params)
    this.vidVal = this.video ? this.getCamera() : true
  }

  static listCameras() {
    const cameras = []
    const getDevices = navigator.mediaDevices.enumerateDevices()

    return getDevices
      .then(info => {
        for (let i = 0; i < info.length; i += 1) {
          if (info[i].kind === 'videoinput') {
            cameras.push(info[i])
          }
        }
        return cameras
      })
      .catch(() => [])
  }

  async getCamera() {
    await navigator.mediaDevices.getUserMedia({
      audio: this.audio,
      camera: this.camera,
    })

    console.log('GET CAM')

    return LiveVideo.listCameras()
      .then(arr => ({
        deviceId: {
          exact: arr[this.camera].deviceId,
          label: arr[this.camera].label,
        },
      }))
      .catch(() => true)
  }

  play() {
    const { audio, video } = this

    return this.vidVal
      .then(v => {
        if (video && navigator.mediaDevices) {
          return navigator.mediaDevices
            .getUserMedia({
              video: v,
              audio,
            })
            .then(stream => {
              try {
                video.srcObject = stream
              } catch (error) {
                video.src = window.URL.createObjectURL(stream)
              }

              video.play()
            })
        }

        return false
      })
      .catch(e => {
        console.log('video or navigator.mediaDevices not found')
        console.log(e)
        return false
      })
  }

  pause() {
    this.video.pause()

    return false
  }
}

export default LiveVideo
