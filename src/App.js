import React, { useState, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { processAudio } from './core/processAudio'
import './App.css';
import CNHWrapper from './components/CNHWrapper';

function App() {
  const [cnhClass, setCnhClass] = useState("ready");
  const [blocked, setBlocked] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const umConstraints = { audio: true };
  const mrConstraints = {
    checkForInactiveTracks: true,
    mimeType: 'audio/wav',
    numberOfAudioChannels: 2,
    recorderType: RecordRTC.StereoAudioRecorder,
    type: 'audio',
  }

  useEffect(() => {
    void async function init() {
      try {
        let um = await navigator.mediaDevices.getUserMedia(umConstraints);
        setMediaRecorder(new RecordRTC(um, mrConstraints));
      } catch (e) {
        console.log(e.message);
      }
    }();
    return () => {
      if (typeof mediaRecorder.destroy !== 'undefined') {
        mediaRecorder.destroy();
      }
    };
  }, []);

  function record() {
    if (blocked) return;
    setCnhClass("record");
    setBlocked(true);
    mediaRecorder.startRecording();
  }

  function stop() {
    mediaRecorder.stopRecording(function () {
      let blob = mediaRecorder.getBlob();
      mediaRecorder.reset();

      let source = processAudio(blob);
      source.onended = function () {
        setCnhClass("ready");
        setBlocked(false);
      };
      setCnhClass("play");
      source.start(0);
    });
  }

  return (
    <div className="App">
      <CNHWrapper
        cnhClass={cnhClass}
        record={record}
        stop={stop}
      />
    </div>
  );
}

export default App;
