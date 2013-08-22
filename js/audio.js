// create the audio context (chrome only for now)
// The name of this file is ambiguous until there's a standard audio context.
// Original code from: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
if ( ! window.console ) console = { log: function(){} };
VisualAudioContext = function (context){
  var audioBuffer,
    sourceNode = {
      buffer: 0
    },
    cache = new Array(),
    splitter, analyser, analyser2, javascriptNode, channels, note,
    setupAudioNodes = function (context) {
      // let's try to cache this.
      // setup a javascript node.
      javascriptNode = context.createJavaScriptNode(2048, 1, 1);
      // connect to destination, else it isn't called
      javascriptNode.connect(context.destination);

      // setup an analyzer
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;

      analyser2 = context.createAnalyser();
      analyser2.smoothingTimeConstant = 0.0;
      analyser2.fftSize = 1024;

      // create a buffer source node
      sourceNode = context.createBufferSource();
      splitter = context.createChannelSplitter();

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
      channels = {
        analyser: analyser,
        analyser2: analyser2
      }
      return true;
    },
    loadSound = function (start, url, dur) {
      var cacheUpdate;
      if($.inArray(url, cacheUpdate)){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        // When loaded decode the data
        request.onload = function () {
          // decode the data
          context.decodeAudioData(request.response, function (buffer) {
              // when the audio is decoded play the sound
              // playSound(buffer, 0);
              sourceNode.buffer = buffer;
              sourceNode.start(0, start, dur - start);
            }, onError);
        }
        cacheUpdate = cachedTracks(url);
        console.log(cacheUpdate);
        request.send();
      } else {
        sourceNode.start(0, start, dur - start);
        console.log('fromCache');
      }
    },
    playSound = function (start, url, dur) {
      if(!audioSet){
        audioSet = setupAudioNodes(context);
      }
      loadSound(start, url, dur);
    },
    stopSound = function () {
      sourceNode.stop(0);
      this.currentTime = context.currentTime;
      javascriptNode.disconnect();
      sourceNode.disconnect();
      audioSet = false;
    },
    onError = function (e) {
      console.log(e);
    },
    cachedTracks = function(track){
      console.log(cache);
      return cache.push(track);
    }
    audioSet = setupAudioNodes(context);
  
  if (audioSet) {
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
    this.javascriptNode = javascriptNode;
    this.loadSound = function (start, url, dur) {
      loadSound(start, url, dur);
    }
    this.stopSound = function (current) {
      stopSound();
    }
    this.playSound = function (start, url, dur) {
      playSound(start, url, dur);
    }
    this.ch = channels;
  } else {
    //error!!!! this.message
  }
}