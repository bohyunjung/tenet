import React, { useState } from 'react';
import RecordRTC from 'recordrtc';

import ts from "./core/singleton.js";
import { processAudio } from './core/processAudio'

import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import GitHubIcon from '@material-ui/icons/GitHub';
import PlayArrowButton from '@material-ui/icons/PlayArrow';

import './App.css';

function App() {
  const [appStatus, setAppStatus] = useState("record");
  const [blocked, setBlocked] = useState(false);

  const umConstraints = { audio: true };
  const mrConstraints = {
    checkForInactiveTracks: true,
    mimeType: 'audio/ogg',
    numberOfAudioChannels: 1,
    audioBitsPerSecond: 320000,
    recorderType: RecordRTC.StereoAudioRecorder,
    type: 'audio',
  }

  async function initMediaRecorder() {
    ts.userMedia = await navigator.mediaDevices.getUserMedia(umConstraints)
    ts.mediaRecorder = RecordRTC(ts.userMedia, mrConstraints);
  }

  function record() {
    initMediaRecorder().then(() => {

      setBlocked(true);
      ts.mediaRecorder.startRecording();

      setTimeout(() => {
        ts.mediaRecorder.stopRecording(() => {
          ts.source = processAudio(ts.mediaRecorder.getBlob());
          ts.mediaRecorder.reset();
          setAppStatus("play");
          setBlocked(false);
          ts.userMedia.getTracks()[0].stop();
        });
      }, 3000);

    }).catch(function (e) {
      console.error(e.name);
      console.error(e.message);
      if (!ts.mediaRecorder) {
        alert("지원하지 않는 환경입니다.\nnot supported in this environment.")
      } else {
        alert("오류가 발생했습니다.\nan error occurred.")
      }
    });
  }

  function play() {
    setBlocked(true);
    ts.source.start(0);
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
      <IconButton
        href="https://github.com/bohyunjung/tenet"
        target="_blank"
        style={{
          position: "absolute",
          right: "5vw",
          top: "5vw"
        }}
      >
        <GitHubIcon
          style={{
            fontSize: 40,
          }}
        />
      </IconButton>
    </div>
  );
}

export default App;
