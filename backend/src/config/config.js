import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Gnani AI credentials & endpoints (STT & TTS)
  gnaniApiKey: process.env.GNANI_API_KEY || '',
  gnaniBaseUrl: process.env.GNANI_BASE_URL || 'https://api.vachana.ai',
  
  // Gnani Prisma V3.0 (STT)
  prismaModel: process.env.GNANI_PRISMA_MODEL || 'prisma-v3.0',
  defaultLanguage: process.env.GNANI_DEFAULT_LANGUAGE || 'indic-auto',
  
  // Gnani Timbre V3.0 (TTS)
  timbreModel: process.env.GNANI_TIMBRE_MODEL || 'timbre-v3.0',
  timbreVoice: process.env.GNANI_TIMBRE_VOICE || 'Shivani', // "Shivani" or "Avinash" for v3.0, "Nalini", "Deepak", "Kaveri" for v2.5
  
  // -------------------------------------------------------------
  // AI Reasoning Models (Priority Cascade)
  // -------------------------------------------------------------
  
  // 1. Gnani Evon (Self-hosted via vLLM or custom OpenAI-compatible endpoint)
  evonApiBaseUrl: process.env.EVON_API_BASE_URL || '', // e.g. http://localhost:8000/v1
  evonApiKey: process.env.EVON_API_KEY || '',
  evonModelName: process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B',
  
  // 2. Gnani Evon via Hugging Face Inference API
  hfApiToken: process.env.HF_API_TOKEN || '',
  
  // 3. Groq API (High-speed Llama 3.3/3.1 inference)
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  
  // 4. Google Gemini API
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  
  // 5. OpenAI API
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  
  // 6. Anthropic API
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  
  // 7. Local LLM / Ollama
  localLlmUrl: process.env.LOCAL_LLM_URL || '', // e.g. http://localhost:11434/v1
  localLlmModel: process.env.LOCAL_LLM_MODEL || 'llama3.2',

  // Mock simulation toggle
  mockMode: process.env.MOCK_MODE === 'true'
};
