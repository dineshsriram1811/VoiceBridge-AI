import { GnaniPrismaService } from '../services/gnaniPrismaService.js';
import { GnaniEvonService } from '../services/gnaniEvonService.js';
import { GnaniTimbreService } from '../services/gnaniTimbreService.js';
import { config } from '../config/config.js';

export class AssistantController {
  /**
   * Complete end-to-end Voice Pipeline:
   * 1. Audio file -> Gnani Prisma V3.0 STT
   * 2. Transcript -> Gnani Evon Reasoning Model
   * 3. AI Response -> Gnani Timbre V3.0 TTS
   * 4. Returns complete transcript, reasoning, and speech audio in one atomic call
   */
  static async processVoicePipeline(req, res, next) {
    const startTime = Date.now();
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file uploaded for voice pipeline.'
        });
      }

      const {
        language_code = 'indic-auto',
        voice = 'Shivani',
        stt_model = 'prisma-v3.0',
        tts_model = 'timbre-v3.0',
        speed = 1.0
      } = req.body;

      console.log(`[Assistant Pipeline] Processing voice input (${req.file.size} bytes)...`);

      // Step 1: Speech-to-Text via Gnani Prisma V3.0
      const sttResult = await GnaniPrismaService.transcribeAudio(req.file, {
        language_code,
        model: stt_model
      });

      const transcript = sttResult.transcript;
      const detectedLang = sttResult.detected_language_code || language_code;

      if (!transcript || transcript.trim() === '') {
        return res.status(200).json({
          success: true,
          transcript: '',
          detectedLanguage: detectedLang,
          responseText: 'मुझे आपकी आवाज़ स्पष्ट सुनाई नहीं दी। कृपया पुनः बोलें। (Could not capture clear speech. Please try again.)',
          audioBase64: null,
          stepTimings: {
            totalMs: Date.now() - startTime
          }
        });
      }

      // Step 2: Reasoning via Gnani Evon / Configured LLM
      const reasoningResult = await GnaniEvonService.generateResponse(transcript, {
        language: detectedLang
      });

      const responseText = reasoningResult.text;

      // Step 3: Text-to-Speech via Gnani Timbre V3.0
      // Detect language of the synthesized response text for optimal TTS voice accent
      const ttsLanguage = reasoningResult.language || (detectedLang === 'indic-auto' ? 'en-IN' : detectedLang);

      const ttsResult = await GnaniTimbreService.synthesizeSpeech(responseText, {
        voice,
        model: tts_model,
        language: ttsLanguage,
        speed: parseFloat(speed) || 1.0
      });

      const totalMs = Date.now() - startTime;
      console.log(`[Assistant Pipeline] Completed successfully in ${totalMs}ms`);

      return res.status(200).json({
        success: true,
        transcript,
        detectedLanguage: detectedLang,
        responseText,
        reasoningModel: reasoningResult.model,
        reasoningProvider: reasoningResult.provider,
        audioBase64: ttsResult.audioBase64,
        ttsVoice: ttsResult.voice,
        ttsModel: ttsResult.model,
        isSimulated: sttResult.isSimulated || ttsResult.isSimulated,
        timing: {
          totalMs,
          sttProcessingTime: sttResult.processing_time
        }
      });
    } catch (error) {
      console.error('[Assistant Pipeline] Pipeline failed:', error);
      next(error);
    }
  }

  /**
   * Health and configuration info for frontend
   */
  static async getConfig(req, res) {
    let activeReasoning = 'VoiceBridge Knowledge Engine (Offline)';
    if (config.evonApiBaseUrl || config.hfApiToken) activeReasoning = 'Gnani Evon';
    else if (config.groqApiKey) activeReasoning = 'Groq';
    else if (config.geminiApiKey) activeReasoning = 'Google Gemini';
    else if (config.openaiApiKey) activeReasoning = 'OpenAI';
    else if (config.localLlmUrl) activeReasoning = 'Local LLM';

    return res.status(200).json({
      success: true,
      serviceName: 'VoiceBridge AI',
      version: '1.0.0',
      gnaniConfigured: Boolean(config.gnaniApiKey),
      evonConfigured: Boolean(config.evonApiBaseUrl || config.hfApiToken),
      groqConfigured: Boolean(config.groqApiKey),
      geminiConfigured: Boolean(config.geminiApiKey),
      openaiConfigured: Boolean(config.openaiApiKey),
      activeReasoningProvider: activeReasoning,
      mockModeActive: config.mockMode,
      models: {
        stt: [
          { id: 'prisma-v3.0', name: 'Gnani Prisma V3.0 (Multilingual)', recommended: true },
          { id: 'prisma-v2.5', name: 'Gnani Prisma V2.5 (Standard)' }
        ],
        tts: [
          { id: 'timbre-v3.0', name: 'Gnani Timbre V3.0 (Expressive)', recommended: true },
          { id: 'timbre-v2.5', name: 'Gnani Timbre V2.5 (Standard)' }
        ],
        reasoning: [
          { id: 'gnani-evon-v3.3-30B-A3B', name: 'Gnani Evon v3.3-30B-A3B (Indic MoE)', configured: Boolean(config.evonApiBaseUrl || config.hfApiToken) },
          { id: 'llama-3.3-70b-versatile', name: 'Groq (Llama 3.3 70B)', configured: Boolean(config.groqApiKey) },
          { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash', configured: Boolean(config.geminiApiKey) },
          { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o Mini', configured: Boolean(config.openaiApiKey) },
          { id: 'voicebridge-knowledge-v1', name: 'VoiceBridge Knowledge Engine (Offline Mode)', configured: true }
        ]
      },
      voices: [
        { id: 'Shivani', name: 'Shivani (Female, Timbre v3.0)', model: 'timbre-v3.0', recommended: true },
        { id: 'Avinash', name: 'Avinash (Male, Timbre v3.0)', model: 'timbre-v3.0' },
        { id: 'Nalini', name: 'Nalini (Female, Timbre v2.5)', model: 'timbre-v2.5' },
        { id: 'Deepak', name: 'Deepak (Male, Timbre v2.5)', model: 'timbre-v2.5' },
        { id: 'Kaveri', name: 'Kaveri (Female, Timbre v2.5)', model: 'timbre-v2.5' }
      ],
      supportedLanguages: [
        { code: 'indic-auto', name: 'Auto Detect (Prisma v3.0 Indic-Auto)', flag: '🇮🇳' },
        { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
        { code: 'en-IN', name: 'Indian English', flag: '🇮🇳' },
        { code: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
        { code: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
        { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
        { code: 'bn-IN', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
        { code: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳' },
        { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
        { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
        { code: 'ml-IN', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' }
      ]
    });
  }

  static async healthCheck(req, res) {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}

