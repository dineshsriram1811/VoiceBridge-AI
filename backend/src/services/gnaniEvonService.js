import axios from 'axios';
import { config } from '../config/config.js';
import { detectLanguage } from '../utils/languageDetector.js';
import { OfflineKnowledgeEngine } from './offlineKnowledgeEngine.js';

/**
 * Service for AI Conversational Reasoning
 * Supports Gnani Evon (vLLM / Hugging Face), Groq, Google Gemini, OpenAI, Anthropic, Local LLMs,
 * and a high-precision Offline Knowledge Engine.
 */
export class GnaniEvonService {
  /**
   * Process a prompt and conversation history through the reasoning model
   * @param {string} prompt - User query
   * @param {Object} options - { language, history, systemPrompt }
   */
  static async generateResponse(prompt, options = {}) {
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error('A non-empty prompt is required for AI reasoning.');
    }

    const cleanPrompt = prompt.trim();
    // Detect target language based on user query and options
    const detectedLang = detectLanguage(cleanPrompt, options.language || 'en-IN');
    const history = Array.isArray(options.history) ? options.history : [];
    const systemPrompt = options.systemPrompt || this._getDefaultSystemPrompt(detectedLang);

    console.log(`[Reasoning Service] Query: "${cleanPrompt.slice(0, 50)}..." | Detected Lang: ${detectedLang}`);

    // 1. Try Gnani Evon via custom vLLM / OpenAI-compatible endpoint
    if (config.evonApiBaseUrl) {
      try {
        console.log(`[Reasoning Service] Querying Gnani Evon endpoint: ${config.evonApiBaseUrl}`);
        return await this._queryOpenAICompatible(config.evonApiBaseUrl, config.evonApiKey, {
          model: config.evonModelName || 'gnani/gnani-evon-v3.3-30B-A3B',
          providerName: 'Gnani Evon (Hosted/vLLM)',
          prompt: cleanPrompt,
          history,
          systemPrompt
        });
      } catch (err) {
        console.warn(`[Gnani Evon] vLLM endpoint error: ${err.message}. Checking next configured provider...`);
        if (!config.groqApiKey && !config.geminiApiKey && !config.openaiApiKey && !config.hfApiToken) {
          throw new Error(`Gnani Evon Endpoint Failed (${config.evonApiBaseUrl}): ${err.message}`);
        }
      }
    }

    // 2. Try Gnani Evon via Hugging Face Inference API
    if (config.hfApiToken) {
      try {
        console.log('[Reasoning Service] Querying Hugging Face for Gnani Evon');
        return await this._queryHuggingFaceEvon(cleanPrompt, systemPrompt);
      } catch (err) {
        console.warn(`[Gnani Evon] Hugging Face inference error: ${err.message}. Checking next configured provider...`);
        if (!config.groqApiKey && !config.geminiApiKey && !config.openaiApiKey) {
          throw new Error(`Hugging Face Evon Inference Failed: ${err.message}`);
        }
      }
    }

    // 3. Try Groq API (High-speed Llama 3.3/3.1)
    if (config.groqApiKey) {
      try {
        console.log('[Reasoning Service] Querying Groq API...');
        return await this._queryOpenAICompatible('https://api.groq.com/openai/v1', config.groqApiKey, {
          model: config.groqModel || 'llama-3.3-70b-versatile',
          providerName: 'Groq',
          prompt: cleanPrompt,
          history,
          systemPrompt
        });
      } catch (err) {
        console.warn(`[Groq API] Error: ${err.message}.`);
        if (!config.geminiApiKey && !config.openaiApiKey) {
          throw new Error(`Groq API Error: ${err.message}`);
        }
      }
    }

    // 4. Try Google Gemini API
    if (config.geminiApiKey) {
      try {
        console.log('[Reasoning Service] Querying Google Gemini...');
        return await this._queryGemini(cleanPrompt, history, systemPrompt, detectedLang);
      } catch (err) {
        console.warn(`[Gemini API] Error: ${err.message}.`);
        if (!config.openaiApiKey) {
          throw new Error(`Google Gemini API Error: ${err.message}`);
        }
      }
    }

    // 5. Try OpenAI API
    if (config.openaiApiKey) {
      try {
        console.log('[Reasoning Service] Querying OpenAI...');
        return await this._queryOpenAICompatible('https://api.openai.com/v1', config.openaiApiKey, {
          model: config.openaiModel || 'gpt-4o-mini',
          providerName: 'OpenAI',
          prompt: cleanPrompt,
          history,
          systemPrompt
        });
      } catch (err) {
        console.warn(`[OpenAI API] Error: ${err.message}.`);
        throw new Error(`OpenAI API Error: ${err.message}`);
      }
    }

    // 6. Try Local LLM / Ollama
    if (config.localLlmUrl) {
      try {
        console.log(`[Reasoning Service] Querying Local LLM at ${config.localLlmUrl}...`);
        return await this._queryOpenAICompatible(config.localLlmUrl, '', {
          model: config.localLlmModel || 'llama3.2',
          providerName: 'Local LLM (Ollama)',
          prompt: cleanPrompt,
          history,
          systemPrompt
        });
      } catch (err) {
        console.warn(`[Local LLM] Error: ${err.message}.`);
      }
    }

    // 7. Offline Knowledge Engine (Fallback when no live LLM API keys are set)
    console.log('[Reasoning Service] No live LLM keys configured; using VoiceBridge Knowledge Engine (Offline Mode)');
    const answer = OfflineKnowledgeEngine.answerQuery(cleanPrompt, detectedLang);

    return {
      text: answer,
      model: 'voicebridge-knowledge-v1',
      provider: 'VoiceBridge Knowledge Engine (Offline Mode)',
      language: detectedLang,
      isSimulated: true,
      note: 'To use live Gnani Evon, Groq, Gemini, or OpenAI, configure API keys in backend/.env.'
    };
  }

  /**
   * Generic OpenAI-compatible chat completion caller (vLLM, Groq, OpenAI, Ollama)
   */
  static async _queryOpenAICompatible(baseUrl, apiKey, { model, providerName, prompt, history, systemPrompt }) {
    const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || m.text || ''
      })),
      { role: 'user', content: prompt }
    ];

    const response = await axios.post(endpoint, {
      model: model,
      messages: messages,
      temperature: 0.6,
      max_tokens: 512
    }, { headers, timeout: 35000 });

    const reply = response.data?.choices?.[0]?.message?.content || '';
    if (!reply.trim()) {
      throw new Error(`Received empty response from ${providerName}`);
    }

    return {
      text: this._cleanResponseText(reply),
      model: model,
      provider: providerName,
      isSimulated: false
    };
  }

  /**
   * Hugging Face Inference API caller for gnani/gnani-evon-v3.3-30B-A3B
   */
  static async _queryHuggingFaceEvon(prompt, systemPrompt) {
    const model = config.evonModelName || 'gnani/gnani-evon-v3.3-30B-A3B';
    const endpoint = `https://api-inference.huggingface.co/models/${model}`;
    const formattedPrompt = `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`;

    const response = await axios.post(endpoint, {
      inputs: formattedPrompt,
      parameters: {
        max_new_tokens: 350,
        temperature: 0.6,
        return_full_text: false
      }
    }, {
      headers: {
        'Authorization': `Bearer ${config.hfApiToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 45000
    });

    let generated = '';
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      generated = response.data[0].generated_text;
    } else if (response.data?.generated_text) {
      generated = response.data.generated_text;
    }

    if (!generated.trim()) {
      throw new Error('Hugging Face returned an empty response.');
    }

    return {
      text: this._cleanResponseText(generated),
      model: model,
      provider: 'Gnani Evon (Hugging Face)',
      isSimulated: false
    };
  }

  /**
   * Google Gemini API caller
   */
  static async _queryGemini(prompt, history, systemPrompt, language) {
    const model = config.geminiModel || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`;

    const contents = [
      ...history.slice(-6).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || m.text || '' }]
      })),
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 512
      }
    };

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!reply.trim()) {
      throw new Error('Received empty response from Gemini API.');
    }

    return {
      text: this._cleanResponseText(reply),
      model: model,
      provider: 'Google Gemini',
      language: language,
      isSimulated: false
    };
  }

  /**
   * Clean markdown asterisks and formatting so text sounds natural when spoken by TTS
   */
  static _cleanResponseText(rawText) {
    return rawText
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold **word**
      .replace(/\*(.*?)\*/g, '$1')     // Italics *word*
      .replace(/#{1,6}\s+/g, '')       // Headers # Header
      .replace(/^\s*[-•*]\s+/gm, '')   // Bullet points
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Inline code blocks
      .trim();
  }

  /**
   * Default system instructions tailored for Indian multilingual conversational voice AI
   */
  static _getDefaultSystemPrompt(language) {
    return `You are VoiceBridge AI, a helpful, intelligent voice assistant.
CRITICAL INSTRUCTIONS:
1. Always answer the user's specific question directly, accurately, and factually.
2. Strictly obey any length or format constraints requested by the user (such as "in three sentences", "in simple English", or "briefly").
3. Respond in the language requested or indicated by the user (${language}).
4. Do NOT include generic greetings, disclaimers, or assistant introduction boilerplate unless the user asked who you are.
5. Do NOT use markdown symbols like asterisks, bullet points, headers, or tables, because your response will be synthesized directly into spoken voice audio.`;
  }
}
