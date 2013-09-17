// create the audio context (chrome only for now)
// The name of this file is ambiguous until there's a standard audio context.
// Original code from: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
VisualAudioContext = function (context, url){
  var vac = this,
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
    setupAudioNodes = function (callback) {
      // connect to destination, else it isn't called
      javascriptNode = context.createJavaScriptNode(2048, 1, 1),
      sourceNode = context.createBufferSource(),
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
      analyser.connect(javascriptNode);

      // splitter.connect(context.destination,0,0);
      // splitter.connect(context.destination,0,1);
      // and connect to destination
      sourceNode.connect(context.destination);
      
      if (bufferActive) {
        sourceNode.buffer = bufferActive;
      }
      
      connected = true;
      vac.javascriptNode = javascriptNode;
      vac.ch = channels;
      
      if (typeof callback == 'function'){
        callback();
      }
    },
    loadSound = function (url, dur) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        loaded = true;
        // When loaded decode the data
        request.onload = function () {
          // decode the data
          context.decodeAudioData(request.response, function (buffer) {
              // when the audio is decoded play the sound
              // playSound(buffer, 0);
              sourceNode.buffer = buffer;
              bufferActive = buffer;
              playSound(url, 0, dur);
            }, onError);
        }
        request.send();
    },
    playSound = function (url, start, dur) {
      start = start || 0;
      if (connected) {
        if (loaded) {
          sourceNode.start(0, start, dur - start);
          console.log(sourceNode.buffer);
        } else{
          loadSound(url, dur);
        } 
      } else {
        setupAudioNodes(function(){
          playSound(url, start, dur);
        });
      }
    },
    stopSound = function (url) {
      this.currentTime = context.currentTime;
      sourceNode.stop(0);
      sourceNode.disconnect();
      javascriptNode.disconnect();
      analyser.disconnect();
      analyser2.disconnect();
      splitter.disconnect();
      connected = false;
    },
    onError = function (e) {
      console.log(e);
    }
    
    setupAudioNodes();
      
    this.getAverageVolume = function (array) {
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
    this.currentTime = function () {
      return context.currentTime;
    }
    this.stopSound = function (current) {
      stopSound();
    }
    this.playSound = function (url, start, dur) {
      playSound(url, start, dur);
    }
    this.ch = channels;
    this.javascriptNode = javascriptNode;
}