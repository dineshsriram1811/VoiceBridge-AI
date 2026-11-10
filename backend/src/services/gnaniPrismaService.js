import axios from 'axios';
import FormData from 'form-data';
import { config } from '../config/config.js';

/**
 * Service for Gnani Prisma V3.0 Speech-to-Text
 * Endpoint: POST https://api.vachana.ai/stt/v3
 * Header: X-API-Key-ID: <API_KEY>
 */
export class GnaniPrismaService {
  /**
   * Transcribe audio using Gnani Prisma V3.0
   * @param {Object} file - Multer file object (buffer, originalname, mimetype)
   * @param {Object} options - { language_code, model, format }
   */
  static async transcribeAudio(file, options = {}) {
    const {
      language_code = config.defaultLanguage || 'indic-auto',
      model = config.prismaModel || 'prisma-v3.0',
      format = 'transcribe'
    } = options;

    // Check if live API key is configured
    if (!config.gnaniApiKey || config.mockMode) {
      console.warn('[Gnani Prisma V3.0] GNANI_API_KEY not configured or MOCK_MODE enabled. Using simulated transcription.');
      return this._simulateTranscription(file, language_code);
    }

    try {
      const formData = new FormData();
      formData.append('audio_file', file.buffer, {
        filename: file.originalname || 'speech.wav',
        contentType: file.mimetype || 'audio/wav'
      });
      formData.append('model', model);
      formData.append('language_code', language_code);
      formData.append('format', format);

      const endpoint = `${config.gnaniBaseUrl}/stt/v3`;
      console.log(`[Gnani Prisma V3.0] Sending request to ${endpoint} with model=${model}, lang=${language_code}`);

      const response = await axios.post(endpoint, formData, {
        headers: {
          ...formData.getHeaders(),
          'X-API-Key-ID': config.gnaniApiKey
        },
        timeout: 45000
      });

      console.log('[Gnani Prisma V3.0] Response received successfully:', response.data);
      return {
        success: true,
        transcript: response.data.transcript || '',
        detected_language_code: response.data.detected_language_code || language_code,
        model: response.data.model || model,
        request_id: response.data.request_id || null,
        processing_time: response.data.processing_time || null,
        isSimulated: false
      };
    } catch (error) {
      console.error('[Gnani Prisma V3.0] API Request Failed:', error.response?.data || error.message);
      
      // If error indicates unauthorized or invalid key, return clear guidance
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(`Gnani API Authentication Failed: Invalid or expired API Key (${error.response.status}). Please check GNANI_API_KEY.`);
      }

      throw new Error(`Gnani Prisma V3.0 STT error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * High-fidelity simulation for testing without active Gnani API key
   */
  static _simulateTranscription(file, language_code) {
    const mockTranscriptions = {
      'indic-auto': 'नमस्ते! वॉयसब्रिज एआई में आपका स्वागत है। आज मैं आपकी क्या सहायता कर सकता हूँ?',
      'hi-IN': 'भारत का राष्ट्रीय पक्षी मोर है और इसकी सुंदरता अद्भुत है।',
      'ta-IN': 'வணக்கம்! வாய்ஸ்பிரிட்ஜ் ஏஐ உங்களை வரவேற்கிறது. நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
      'te-IN': 'నమస్కారం! వాయిస్ బ్రిడ్జ్ ఏఐ మిమ్మల్ని స్వాగతిస్తోంది. నేను మీకు ఎలా సహాయం చేయగలను?',
      'kn-IN': 'ನಮಸ್ಕಾರ! ವಾಯ್ಸ್‌ಬ್ರಿಡ್ಜ್ ಎಐಗೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      'bn-IN': 'নমস্কার! ভয়েসব্রিজ এআই-তে আপনাকে স্বাগতম। আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
      'mr-IN': 'नमस्कार! व्हॉइसब्रिज एआय मध्ये आपले स्वागत आहे. मी आपल्याला कशी मदत करू शकतो?',
      'gu-IN': 'નમસ્તે! વોઈસબ્રિજ એઆઈમાં તમારું સ્વાગત છે. હું તમને કેવી રીતે મદદ કરી શકું?',
      'en-IN': 'Hello and welcome to VoiceBridge AI! How can I assist you today with Indian language intelligence?'
    };

    const transcript = mockTranscriptions[language_code] || mockTranscriptions['indic-auto'];
    const detectedLang = language_code === 'indic-auto' ? 'hi-IN' : language_code;

    return {
      success: true,
      transcript: transcript,
      detected_language_code: detectedLang,
      model: 'prisma-v3.0',
      request_id: `sim-${Date.now()}`,
      processing_time: 0.42,
      isSimulated: true,
      simulationNote: 'Simulated response: Add GNANI_API_KEY in backend/.env to use live Gnani Prisma V3.0 API.'
    };
  }
}

