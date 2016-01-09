// create the audio context (chrome only for now)
// The name of this file is ambiguous until there's a standard audio context.
// Original code from: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
VisualAudioContext = function(url, mediaStream, audioTag) {
  var vac = this,
    context = typeof AudioContext !== 'undefined' ?
	    new AudioContext() :
	    typeof webkitAudioContext !== 'undefined' ?
	    new webkitAudioContext() : function(){
    		$('.no-support').show();
    		return false;
	  },
    cache = {},
    loaded = false,
    connected = false,
    bufferActive,
    javascriptNode,
    sourceNode,
    splitter,
    analyser,
    analyser2,
    channels,
    mediaStreamSource,
    streamRecorder,
    gainNode,
    init = function(vol) {
      gainNode = context.createGain(),
        splitter = context.createChannelSplitter(),
        analyser = context.createAnalyser(),
        analyser2 = context.createAnalyser(),
        channels = {
          analyser: analyser,
          analyser2: analyser2
        }

      javascriptNode.connect(context.destination);

      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;
      analyser2.smoothingTimeConstant = 0.0;
      analyser2.fftSize = 1024;

      // connect the source to the analyser and the splitter
      sourceNode.connect(splitter);

      // connect one of the outputs from the splitter to
      // the analyser
      splitter.connect(analyser, 0, 0);
      splitter.connect(analyser2, 1, 0);

      // connect the splitter to the javascriptnode
      // we use the javascript node to draw at a
      // specific interval.
      // Volume
      sourceNode.connect(gainNode);
      gainNode.gain.value = vol;

      // splitter.connect(context.destination,0,0);
      // splitter.connect(context.destination,0,1);
      // and connect to destination
      // NEED FOR SC VERSION!!!!!!!!!
      //sourceNode.connect(context.destination);
      if (bufferActive) {
        sourceNode.buffer = bufferActive;
      }

      connected = true;
      vac.javascriptNode = javascriptNode;
      this.sourceNode = sourceNode;
      this.gainNode = gainNode;
      context.suspend();

      if (typeof callback == 'function') {
        callback();
      }
    },
    setupMicNodes = function() {
      mediaStreamNode = context.createMediaStreamSource(mediaStream);
      javascriptNode = context.createScriptProcessor(2048, 1, 1)
      sourceNode = mediaStreamNode;
      init(0);
    },
    setupAudioNodes = function() {
      javascriptNode = context.createScriptProcessor(2048, 1, 1);
      sourceNode = audioTag;
      init(0.5);
    }

  if (!mediaStream) {
    setupAudioNodes();
  } else {
    setupMicNodes();
  }

  this.getAverageVolume = function(array) {
    var values = 0,
      length = array.length,
      average;
    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
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
    console.log('close');
  }
}

module.exports = VisualAudioContext;
