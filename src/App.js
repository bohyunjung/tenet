import React, { useState, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { processAudio } from './core/processAudio'
import './App.css';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowButton from '@material-ui/icons/PlayArrow';


function App() {
  const [appStatus, setAppStatus] = useState("record");
  const [blocked, setBlocked] = useState(false);
  const [source, setSource] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const umConstraints = { audio: true };
  const mrConstraints = {
    checkForInactiveTracks: true,
    mimeType: 'audio/ogg',
    numberOfAudioChannels: 1,
    audioBitsPerSecond: 320000,
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
    if (!mediaRecorder) {
        alert("지원하지 않는 환경입니다.\nnot supported in this environment.")
        return
    }
    setBlocked(true);
    mediaRecorder.startRecording();
    setTimeout(() => {
      mediaRecorder.stopRecording(function () {
        setSource(processAudio(mediaRecorder.getBlob()));
        mediaRecorder.reset();
        setAppStatus("play");
        setBlocked(false);
      });
    }, 3000)
  }

  function play() {
    setBlocked(true);
    source.start(0);
    setTimeout(() => {
      setAppStatus("record");
      setBlocked(false);
    }, 3500);
  }

  return (
    <div className="App">
      <div className={appStatus + "-" + blocked}>
        <IconButton
          disableFocusRipple={true}
          disableRipple={true}
          style={{
            backgroundColor: 'transparent',
            height: '100vh'
          }}
          disabled={blocked}
          onClick={
            appStatus === "record" ?
              record : play
          }
        >
          {appStatus === "record" ?
            <MicIcon
              style={{ fontSize: 200 }}
            /> :
            <PlayArrowButton
              style={{ fontSize: 200 }}
            />
          }
        </IconButton>
      </div>
    </div>
  );
}

export default App;
