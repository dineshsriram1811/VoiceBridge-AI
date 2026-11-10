/**
 * In-browser PCM WAV Recorder & Audio Analyser
 * Generates standards-compliant 16-bit PCM WAV blobs without external dependencies
 */
export class WavRecorder {
  constructor() {
    this.audioContext = null;
    this.mediaStream = null;
    this.sourceNode = null;
    this.processorNode = null;
    this.analyserNode = null;
    this.recordedBuffers = [];
    this.recordingLength = 0;
    this.isRecording = false;
    this.targetSampleRate = 16000; // Optimal for speech recognition
  }

  /**
   * Start recording microphone input
   */
  async start() {
    this.recordedBuffers = [];
    this.recordingLength = 0;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
    
    // Request microphone access
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

    // Create AnalyserNode for live visualization
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.8;
    this.sourceNode.connect(this.analyserNode);

    // Buffer size 4096 gives smooth processing
    const bufferSize = 4096;
    this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      // Clone buffer
      this.recordedBuffers.push(new Float32Array(inputData));
      this.recordingLength += inputData.length;
    };

    this.analyserNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);

    this.isRecording = true;
  }

  /**
   * Get live frequency data array for visualizer
   */
  getFrequencyData(outputArray) {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(outputArray);
    }
  }

  /**
   * Stop recording and return WAV Blob
   * @returns {Promise<Blob>} Standard WAV audio file
   */
  async stop() {
    this.isRecording = false;

    // Disconnect and release tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.processorNode) {
      this.processorNode.disconnect();
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }
    if (this.analyserNode) {
      this.analyserNode.disconnect();
    }

    const nativeSampleRate = this.audioContext ? this.audioContext.sampleRate : 44100;
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
    }

    // Merge channel buffers
    const merged = new Float32Array(this.recordingLength);
    let offset = 0;
    for (let i = 0; i < this.recordedBuffers.length; i++) {
      merged.set(this.recordedBuffers[i], offset);
      offset += this.recordedBuffers[i].length;
    }

    // Downsample to target sample rate (16000Hz) if native sample rate is higher
    const downsampled = this._downsampleBuffer(merged, nativeSampleRate, this.targetSampleRate);
    const wavBlob = this._encodeWAV(downsampled, this.targetSampleRate);

    return wavBlob;
  }

  _downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      return buffer;
    }
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  _encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this._writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    this._writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    this._writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);  // AudioFormat 1 = PCM
    view.setUint16(22, 1, true);  // NumChannels 1 = Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
    view.setUint16(32, 2, true);  // BlockAlign (NumChannels * BitsPerSample/8)
    view.setUint16(34, 16, true); // BitsPerSample 16 bits

    // data sub-chunk
    this._writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write PCM 16-bit audio samples
    let index = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      index += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  _writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

