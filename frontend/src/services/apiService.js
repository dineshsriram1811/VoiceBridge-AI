import axios from 'axios';

const API_BASE = '/api';

export const apiService = {
  /**
   * Fetch backend configuration and model catalog
   */
  async getConfig() {
    const response = await axios.get(`${API_BASE}/assistant/config`);
    return response.data;
  },

  /**
   * Speech-to-Text via Gnani Prisma V3.0
   * @param {Blob|File} audioBlob - Audio recording or file
   * @param {Object} options - { language_code, model, format }
   */
  async transcribeAudio(audioBlob, options = {}) {
    const formData = new FormData();
    const filename = audioBlob.name || 'recording.wav';
    formData.append('audio_file', audioBlob, filename);
    
    if (options.language_code) formData.append('language_code', options.language_code);
    if (options.model) formData.append('model', options.model);
    if (options.format) formData.append('format', options.format);

    const response = await axios.post(`${API_BASE}/stt/transcribe`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    });
    return response.data;
  },

  /**
   * Text-to-Speech via Gnani Timbre V3.0
   * @param {string} text - Text to synthesize
   * @param {Object} options - { voice, model, language, speed }
   */
  async synthesizeSpeech(text, options = {}) {
    const response = await axios.post(`${API_BASE}/tts/synthesize`, {
      text,
      voice: options.voice || 'Shivani',
      model: options.model || 'timbre-v3.0',
      language: options.language || 'hi-IN',
      speed: options.speed || 1.0
    }, { timeout: 60000 });
    return response.data;
  },

  /**
   * Reasoning / Text Query via Gnani Evon
   * @param {string} message - User query
   * @param {Object} options - { language, history, systemPrompt }
   */
  async sendChatMessage(message, options = {}) {
    const response = await axios.post(`${API_BASE}/chat/respond`, {
      message,
      language: options.language || 'hi-IN',
      history: options.history || []
    }, { timeout: 45000 });
    return response.data;
  },

  /**
   * End-to-End Voice Pipeline
   * Sends audio -> STT -> LLM Reasoning -> TTS -> Audio response
   */
  async processVoicePipeline(audioBlob, options = {}) {
    const formData = new FormData();
    const filename = audioBlob.name || 'recording.wav';
    formData.append('audio_file', audioBlob, filename);
    
    if (options.language_code) formData.append('language_code', options.language_code);
    if (options.voice) formData.append('voice', options.voice);
    if (options.stt_model) formData.append('stt_model', options.stt_model);
    if (options.tts_model) formData.append('tts_model', options.tts_model);
    if (options.speed) formData.append('speed', options.speed);

    const response = await axios.post(`${API_BASE}/assistant/pipeline`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 90000
    });
    return response.data;
  }
};

