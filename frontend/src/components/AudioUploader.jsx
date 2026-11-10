import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, Check, X, AlertCircle } from 'lucide-react';

export default function AudioUploader({ onAudioUploaded, disabled = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setErrorMsg(null);
    if (!file) return;

    // Check size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds 25 MB limit.');
      return;
    }

    // Check format
    const validExtensions = /\.(wav|mp3|ogg|webm|flac|aac|m4a)$/i;
    if (!file.name.match(validExtensions) && !file.type.startsWith('audio/')) {
      setErrorMsg('Please select a supported audio file (WAV, MP3, OGG, M4A, FLAC).');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleProcess = () => {
    if (selectedFile) {
      onAudioUploaded(selectedFile);
      setSelectedFile(null);
    }
  };

  const loadPresetSample = async (filename, label) => {
    try {
      setErrorMsg(null);
      const res = await fetch(`/api/samples/${filename}`);
      if (!res.ok) throw new Error('Sample file could not be loaded.');
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'audio/wav' });
      setSelectedFile(file);
    } catch (err) {
      setErrorMsg(`Failed to load preset sample: ${err.message}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-2xl border border-slate-200 shadow-card">
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.wav,.mp3,.ogg,.webm,.m4a,.flac"
        onChange={handleChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <UploadCloud size={28} />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">
            Click to upload or drag & drop audio
          </p>
          <p className="text-xs text-slate-400">
            Supports WAV, MP3, OGG, M4A, FLAC (Max: 25MB, up to 30s)
          </p>

          {/* Quick preset audio clips for testing */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 w-full" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              Or test with pre-recorded Indic audio samples:
            </p>
            <div className="grid grid-cols-2 gap-1.5 w-full">
              <button
                type="button"
                onClick={() => loadPresetSample('sample_hindi.wav', 'Hindi')}
                className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg font-medium transition-colors border border-slate-200 text-left truncate"
              >
                🇮🇳 Hindi Sample (.wav)
              </button>
              <button
                type="button"
                onClick={() => loadPresetSample('sample_english.wav', 'English')}
                className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg font-medium transition-colors border border-slate-200 text-left truncate"
              >
                🇮🇳 English Sample (.wav)
              </button>
              <button
                type="button"
                onClick={() => loadPresetSample('sample_tamil.wav', 'Tamil')}
                className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg font-medium transition-colors border border-slate-200 text-left truncate"
              >
                🇮🇳 Tamil Sample (.wav)
              </button>
              <button
                type="button"
                onClick={() => loadPresetSample('sample_telugu.wav', 'Telugu')}
                className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg font-medium transition-colors border border-slate-200 text-left truncate"
              >
                🇮🇳 Telugu Sample (.wav)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <FileAudio size={20} />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-800 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>

          <button
            onClick={handleProcess}
            disabled={disabled}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
          >
            <Check size={16} />
            <span>Process Audio with Prisma V3.0</span>
          </button>
        </div>
      )}
    </div>
  );
}

