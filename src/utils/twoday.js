let chunks = [];
let timer;
let ctx;
let source;
let recordingOne;
let recordingTwo;
let counter = 0;
let captureStreamTest = false;
let stream;



const TwoDay = {
  creatingBlob(audio) {
      let firstChunks = [];
      let secondChunks = [];
      let timeSlice = 1000;
  
      try {
        audio.captureStream()
        captureStreamTest = true
      } catch(err) {}
      if(!captureStreamTest) {
        try {
          audio.mozCaptureStream()
          captureStreamTest = 'moz'
        } catch(err) {console.log(err)}
      }
      if(captureStreamTest === true) {
        stream = audio.captureStream()

      } else if (captureStreamTest === 'moz') {

        const AudioContext = window.AudioContext || window.webkitAudioContext
        ctx = new AudioContext()
        source = ctx.createMediaElementSource(audio)
        stream = audio.mozCaptureStream()
        source.connect(ctx.destination);

      } else {
        alert('Audio capture not supported in this browser')
        return
      }
      recordingOne = new MediaRecorder(stream)
      recordingOne.ondataavailable = function(event) {
        firstChunks.push(event.data);  
        }
      recordingOne.onstop = function() {
        firstChunks = [];
      }
      recordingTwo = new MediaRecorder(stream)
      recordingTwo.ondataavailable = function(event) {
        secondChunks.push(event.data);  
        }
      recordingTwo.onstop = function() {
        secondChunks = [];
      }
      const recordingTimer = () => {
          if(counter === 0) {
            recordingOne.start(timeSlice)  
            recordingTwo.start(timeSlice)
            chunks = firstChunks
          }
          if(counter === 5) {
            chunks = firstChunks
            if(recordingTwo.state === 'recording') recordingTwo.stop()
            recordingTwo.start(timeSlice)
          }
          if(counter === 14) {
            chunks = secondChunks
            if(recordingOne.state === 'recording') recordingOne.stop()
            recordingOne.start(timeSlice)
          }
          if(counter === 22){
            counter = 4;
          }
          counter++;
      }
      timer = setInterval(recordingTimer, 1000)
  },
  
  tearDown() {
    chunks = []
    counter = 0
    clearInterval(timer)
    if(recordingOne.state === 'recording') {
      recordingOne.stop()
    }
    if(recordingTwo.state === 'recording') {
      recordingTwo.stop()
    }
    if(captureStreamTest === 'moz') {
      source.disconnect(ctx.destination)
      ctx.close()
      source = null
    }
  },

  callBlob() {
      if(chunks.length <= 2) {
        return false
      }
      const audioBlob = new Blob(chunks, {'type': 'audio/webm'})  
      return audioBlob
  }
};

export default TwoDay;
