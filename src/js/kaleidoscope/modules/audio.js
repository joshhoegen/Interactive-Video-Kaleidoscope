// create the audio context (chrome only for now)
// The name of this file is ambiguous until there's a standard audio context.
// Original code from: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
let VisualAudioContext = function(url, mediaStream, audioTag) {
  const vac = this;

  const context = typeof AudioContext !== 'undefined' ?
    new AudioContext() :
    typeof webkitAudioContext !== 'undefined' ?
    new webkitAudioContext() : () => {
      alert('Web context not available in this browser.');
      return false;
  };

  const cache = {};
  const loaded = false;
  let connected = false;
  let bufferActive;
  let javascriptNode;
  let sourceNode;
  let splitter;
  let analyser;
  let analyser2;
  let channels;
  let mediaStreamNode;
  let mediaStreamSource;
  let streamRecorder;
  let gainNode;

  const init = vol => {
    gainNode = context.createGain(),
      splitter = context.createChannelSplitter(),
      analyser = context.createAnalyser(),
      analyser2 = context.createAnalyser(),
      channels = {
        analyser,
        analyser2
      }

    javascriptNode.connect(context.destination);

    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;
    analyser2.smoothingTimeConstant = 0.0;
    analyser2.fftSize = 1024;

    // connect the source to the analyser and the splitter
    sourceNode.connect(splitter);

    splitter.connect(analyser, 0, 0);
    splitter.connect(analyser2, 1, 0);

    sourceNode.connect(gainNode);
    gainNode.gain.value = vol;

    // NEED FOR SoundCloud VERSION!!!!!!!!!
    //sourceNode.connect(context.destination);
    if (bufferActive) {
      sourceNode.buffer = bufferActive;
    }

    connected = true;
    vac.javascriptNode = javascriptNode;
    vac.sourceNode = sourceNode;
    vac.gainNode = gainNode;
    context.suspend();

    if (typeof callback == 'function') {
      callback();
    }
  };

  const setupMicNodes = () => {
    mediaStreamNode = context.createMediaStreamSource(mediaStream);
    javascriptNode = context.createScriptProcessor(2048, 1, 1)
    sourceNode = mediaStreamNode;
    init(0);
  };

  const setupAudioNodes = () => {
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    sourceNode = audioTag;
    init(0.5);
  };

  if (!mediaStream) {
    setupAudioNodes();
  } else {
    setupMicNodes();
  }

  this.getAverageVolume = array => {
    let values = 0;
    const length = array.length;
    let average;
    // get all the frequency amplitudes
    for (let i = 0; i < length; i++) {
      values += array[i];
    }
    average = values / length;
    return average;
  }
  this.ch = channels;
  this.javascriptNode = javascriptNode;
  this.sourceNode = sourceNode;
  this.gainNode = gainNode;
  this.resume = function() {
    this.gainNode.gain.value = 0.2;
    this.sourceNode.connect(this.gainNode.gain);
    context.resume();
  },
  this.close = function() {
    this.gainNode.gain.value = 0;
    this.sourceNode.connect(this.gainNode.gain);
    context.suspend();
  }
}

export default VisualAudioContext;
