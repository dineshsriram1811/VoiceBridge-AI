import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, X, AlertCircle } from 'lucide-react';
import { WavRecorder } from '../utils/wavRecorder';
import WaveformVisualizer from './WaveformVisualizer';

export default function AudioRecorder({ onRecordingComplete, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [micError, setMicError] = useState(null);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.isRecording) {
        recorderRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startRecording = async () => {
    setMicError(null);
    try {
      const recorder = new WavRecorder();
      recorderRef.current = recorder;
      await recorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration(prev => {
          // Max 30 seconds for REST STT
          if (prev >= 29) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start microphone:', err);
      setMicError('Microphone access denied or unavailable. Please check browser microphone permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      setIsRecording(false);
      const audioBlob = await recorderRef.current.stop();
      if (audioBlob && audioBlob.size > 1000) {
        onRecordingComplete(audioBlob);
      } else {
        setMicError('Recording was too short. Please speak clearly for at least 1-2 seconds.');
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setMicError('Error capturing audio. Please try again.');
    } finally {
      setRecordDuration(0);
    }
  };

  const cancelRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recorderRef.current) {
      try {
        await recorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    setRecordDuration(0);
  };

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-card transition-all">
      {micError && (
        <div className="mb-4 w-full p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Waveform Visualizer */}
      <div className="w-full flex justify-center mb-5 h-16">
        <WaveformVisualizer
          isRecording={isRecording}
          isPlaying={false}
          recorderRef={recorderRef}
          barCount={36}
          className="w-full max-w-sm"
        />
      </div>

      {/* Main Microphone Button */}
      <div className="relative flex items-center justify-center my-2">
        {/* Animated Ripple Rings when recording */}
        {isRecording && (
          <>
            <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />
            <div className="absolute w-20 h-20 rounded-full bg-blue-500/30 pulse-ring-active pointer-events-none" />
          </>
        )}

        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={disabled}
            className={`w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-500/40'
            }`}
            title="Start Voice Recording"
          >
            <Mic size={32} className="stroke-[2.2]" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40 transition-all hover:scale-105 active:scale-95"
            title="Stop & Process Speech"
          >
            <Square size={28} className="fill-current" />
          </button>
        )}
      </div>

      {/* Status & Timer */}
      <div className="mt-4 flex flex-col items-center">
        {isRecording ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold animate-pulse border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Recording ({formatDuration(recordDuration)} / 0:30)
            </span>
            <button
              onClick={cancelRecording}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Cancel Recording"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-500">
            Click microphone to speak in any Indian language
          </p>
        )}
        <span className="text-[11px] text-slate-400 mt-1">
          Powered by Gnani Prisma V3.0 (PCM 16kHz WAV)
        </span>
      </div>
    </div>
  );
}

