import axios from 'axios';
import { config } from '../config/config.js';

/**
 * Service for Gnani Timbre V3.0 Text-to-Speech
 * Endpoint: POST https://api.vachana.ai/api/v1/tts/inference
 * Headers: X-API-Key-ID, Content-Type: application/json
 */
export class GnaniTimbreService {
  /**
   * Synthesize text to speech using Gnani Timbre V3.0
   * @param {string} text - Text to synthesize
   * @param {Object} options - { voice, model, language, speed, audio_config }
   */
  static async synthesizeSpeech(text, options = {}) {
    if (!text || text.trim() === '') {
      throw new Error('Text parameter is required for TTS synthesis.');
    }

    const {
      voice = config.timbreVoice || 'Shivani',
      model = config.timbreModel || 'timbre-v3.0',
      language = 'hi-IN',
      speed = 1.0,
      audio_config = {
        sample_rate: 48000,
        num_channels: 1,
        sample_width: 2,
        encoding: 'linear_pcm',
        container: 'wav'
      }
    } = options;

    // Check if live API key is configured
    if (!config.gnaniApiKey || config.mockMode) {
      console.warn('[Gnani Timbre V3.0] GNANI_API_KEY not configured or MOCK_MODE enabled. Generating simulated audio WAV.');
      const simulatedWavBuffer = this._generateSimulatedWav(text);
      return {
        success: true,
        audioBuffer: simulatedWavBuffer,
        audioBase64: `data:audio/wav;base64,${simulatedWavBuffer.toString('base64')}`,
        contentType: 'audio/wav',
        model: model,
        voice: voice,
        language: language,
        isSimulated: true,
        simulationNote: 'Simulated audio: Add GNANI_API_KEY in backend/.env to use live Gnani Timbre V3.0 API.'
      };
    }

    try {
      const endpoint = `${config.gnaniBaseUrl}/api/v1/tts/inference`;
      const payload = {
        text: text,
        voice: voice,
        model: model,
        language: language,
        speed: parseFloat(speed) || 1.0,
        audio_config: audio_config
      };

      console.log(`[Gnani Timbre V3.0] Requesting TTS: voice=${voice}, model=${model}, lang=${language}`);

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key-ID': config.gnaniApiKey
        },
        responseType: 'arraybuffer',
        timeout: 45000
      });

      const audioBuffer = Buffer.from(response.data);
      const audioBase64 = `data:audio/wav;base64,${audioBuffer.toString('base64')}`;

      console.log(`[Gnani Timbre V3.0] TTS synthesis successful, buffer size: ${audioBuffer.length} bytes`);

      return {
        success: true,
        audioBuffer: audioBuffer,
        audioBase64: audioBase64,
        contentType: response.headers['content-type'] || 'audio/wav',
        model: model,
        voice: voice,
        language: language,
        isSimulated: false
      };
    } catch (error) {
      let errorMessage = error.message;
      if (error.response?.data) {
        try {
          // If error returned JSON arraybuffer
          const decoded = Buffer.from(error.response.data).toString('utf-8');
          const parsed = JSON.parse(decoded);
          errorMessage = parsed.message || parsed.error || errorMessage;
        } catch {
          // Keep default message
        }
      }

      console.error('[Gnani Timbre V3.0] TTS API Error:', errorMessage);

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(`Gnani API Authentication Failed: Invalid or expired API Key (${error.response.status}). Please check GNANI_API_KEY.`);
      }

      throw new Error(`Gnani Timbre V3.0 TTS error: ${errorMessage}`);
    }
  }

  /**
   * Helper: Generate a valid 48kHz PCM WAV audio buffer with gentle musical melody tones
   * for realistic previewing when Gnani API key is not yet set
   */
  static _generateSimulatedWav(text) {
    const sampleRate = 24000;
    // Calculate duration based on text length: roughly 0.08 seconds per word, min 1.5s, max 4s
    const wordCount = text.split(/\s+/).length;
    const durationSeconds = Math.min(Math.max(wordCount * 0.12, 1.5), 4.0);
    const numSamples = Math.floor(sampleRate * durationSeconds);
    const numChannels = 1;
    const bytesPerSample = 2; // 16-bit
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;

    const buffer = Buffer.alloc(44 + dataSize);

    // RIFF chunk descriptor
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);

    // "fmt " sub-chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // Subchunk1Size for PCM
    buffer.writeUInt16LE(1, 20);  // AudioFormat 1 = PCM
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(byteRate, 28);
    buffer.writeUInt16LE(blockAlign, 32);
    buffer.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample

    // "data" sub-chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    // Synthesize a pleasant dual harmonic tone with ADSR envelope
    const baseFreq = 440; // A4
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Frequency variation to mimic speech inflection
      const pitchMod = Math.sin(2 * Math.PI * 3 * t) * 30;
      const freq = baseFreq + pitchMod;
      
      // Amplitude envelope (attack and decay)
      let envelope = 1.0;
      if (t < 0.1) envelope = t / 0.1;
      else if (t > durationSeconds - 0.3) envelope = (durationSeconds - t) / 0.3;

      // Harmonic blend
      const sampleValue = Math.sin(2 * Math.PI * freq * t) * 0.6 +
                          Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.3;
      
      const int16 = Math.max(-32768, Math.min(32767, Math.floor(sampleValue * envelope * 12000)));
      buffer.writeInt16LE(int16, 44 + i * 2);
    }

    return buffer;
  }
}

