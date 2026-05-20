import React, { useState, useRef } from 'react';
import { processAudio } from './core/processAudio';
import './App.css';

const RECORD_DURATION_MS = 3000;

const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
];

function getSupportedMimeType() {
  return SUPPORTED_MIME_TYPES.find(
    (type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)
  ) || '';
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="44" height="44" aria-hidden="true">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="44" height="44" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="spin" viewBox="0 0 24 24" fill="none" width="44" height="44" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function App() {
  const [status, setStatus] = useState('idle'); // idle | recording | processing | ready | playing | error
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(RECORD_DURATION_MS / 1000);
  const [errorMsg, setErrorMsg] = useState('');

  const audioRef = useRef(null);
  const rafRef = useRef(null);

  async function startRecording() {
    setErrorMsg('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('마이크를 사용할 수 없습니다. Please try a different browser.');
      setStatus('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setStatus('processing');
        setProgress(0);
        try {
          const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
          audioRef.current = await processAudio(blob);
          setStatus('ready');
        } catch (err) {
          console.error('processAudio error:', err);
          setErrorMsg('오디오 처리 중 오류가 발생했습니다. Audio processing failed.');
          setStatus('error');
        }
      };

      mediaRecorder.start();
      setStatus('recording');

      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / RECORD_DURATION_MS) * 100);
        setProgress(pct);
        setCountdown(Math.max(0, (RECORD_DURATION_MS - elapsed) / 1000));
        if (elapsed < RECORD_DURATION_MS) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);

      setTimeout(() => {
        cancelAnimationFrame(rafRef.current);
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, RECORD_DURATION_MS);
    } catch (err) {
      const denied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setErrorMsg(
        denied
          ? '마이크 접근 권한이 필요합니다. Microphone permission required.'
          : '마이크를 사용할 수 없습니다. Microphone unavailable.'
      );
      setStatus('error');
    }
  }

  async function playReversed() {
    if (!audioRef.current || status !== 'ready') return;
    const { context, source } = audioRef.current;

    try {
      if (context.state === 'suspended') {
        await context.resume();
      }
      setStatus('playing');
      source.start(0);
      source.onended = () => {
        setStatus('idle');
        audioRef.current = null;
      };
    } catch (err) {
      console.error('playReversed error:', err);
      setStatus('idle');
      audioRef.current = null;
    }
  }

  function handleClick() {
    if (status === 'idle') startRecording();
    else if (status === 'ready') playReversed();
    else if (status === 'error') {
      setStatus('idle');
      setErrorMsg('');
    }
  }

  const isDisabled = status === 'recording' || status === 'processing' || status === 'playing';
  const ringR = 52;
  const ringC = 2 * Math.PI * ringR;

  return (
    <div className="app">
      <a
        href="https://github.com/bohyunjung/tenet"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label="GitHub repository"
      >
        <GitHubIcon />
      </a>

      <main className="main">
        <header className="header">
          <h1 className="title">TENET</h1>
          <p className="subtitle">역재생 · reverse playback</p>
        </header>

        <div className="controls">
          <div className="btn-wrap">
            <button
              className={`btn btn--${status}`}
              onClick={handleClick}
              disabled={isDisabled}
              aria-label={
                status === 'idle'
                  ? 'Start recording'
                  : status === 'ready'
                  ? 'Play reversed audio'
                  : status
              }
            >
              <span className="btn__icon">
                {(status === 'idle' || status === 'error') && <MicIcon />}
                {status === 'recording' && <MicIcon />}
                {status === 'processing' && <SpinnerIcon />}
                {status === 'ready' && <PlayIcon />}
                {status === 'playing' && <SpinnerIcon />}
              </span>
            </button>

            {status === 'recording' && (
              <svg
                className="ring"
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
                <circle className="ring__bg" cx="60" cy="60" r={ringR} />
                <circle
                  className="ring__fill"
                  cx="60"
                  cy="60"
                  r={ringR}
                  style={{
                    strokeDasharray: ringC,
                    strokeDashoffset: ringC * (1 - progress / 100),
                  }}
                />
              </svg>
            )}
          </div>

          <p className="status-label" role="status" aria-live="polite">
            {status === 'idle' && '탭하여 녹음 · tap to record'}
            {status === 'recording' && `녹음 중 · ${countdown.toFixed(1)}s`}
            {status === 'processing' && '처리 중 · processing…'}
            {status === 'ready' && '탭하여 역재생 · tap to play reversed'}
            {status === 'playing' && '역재생 중 · playing reversed…'}
            {status === 'error' && (errorMsg || '오류가 발생했습니다. Tap to retry.')}
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
