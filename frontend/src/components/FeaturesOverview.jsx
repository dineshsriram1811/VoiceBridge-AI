import React from 'react';
import { Mic, Cpu, Volume2, Globe, Shield, Code, Zap, CheckCircle2 } from 'lucide-react';

export default function FeaturesOverview() {
  const languages = [
    { code: 'hi-IN', name: 'Hindi', script: 'हिंदी', sample: 'नमस्ते! आप कैसे हैं?' },
    { code: 'en-IN', name: 'Indian English', script: 'English', sample: 'Welcome to VoiceBridge AI!' },
    { code: 'ta-IN', name: 'Tamil', script: 'தமிழ்', sample: 'வணக்கம்! எப்படி இருக்கிறீர்கள்?' },
    { code: 'te-IN', name: 'Telugu', script: 'తెలుగు', sample: 'నమస్కారం! మీరు ఎలా ఉన్నారు?' },
    { code: 'kn-IN', name: 'Kannada', script: 'ಕನ್ನಡ', sample: 'ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?' },
    { code: 'bn-IN', name: 'Bengali', script: 'বাংলা', sample: 'নমস্কার! আপনি কেমন আছেন?' },
    { code: 'mr-IN', name: 'Marathi', script: 'मराठी', sample: 'नमस्कार! आपण कसे आहात?' },
    { code: 'gu-IN', name: 'Gujarati', script: 'ગુજરાતી', sample: 'નમસ્તે! તમે કેમ છો?' },
    { code: 'pa-IN', name: 'Punjabi', script: 'ਪੰਜਾਬੀ', sample: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?' },
    { code: 'ml-IN', name: 'Malayalam', script: 'മലയാളം', sample: 'നമസ്കാരം! സുഖമാണോ?' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prisma Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Mic size={24} />
          </div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Speech-to-Text
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 mb-2">
            Gnani Prisma V3.0
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Unified speech recognition model supporting automatic language identification (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">indic-auto</code>), code-mixed Hinglish/Tanglish speech, and low-latency REST & streaming audio pipelines.
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>Multi-language auto detection</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>Inverse Text Normalization (ITN)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>Handles background noise & accents</span>
            </li>
          </ul>
        </div>

        {/* Reasoning Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Cpu size={24} />
          </div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            Reasoning Architecture
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 mb-2">
            Indic AI Reasoning
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Flexible reasoning pipeline supporting sovereign Indic models like Gnani Evon (v3.3-30B-A3B), high-speed cloud LLMs (Groq, Gemini, OpenAI), and the VoiceBridge Knowledge Engine for offline precision.
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>Gnani Evon (vLLM & Hugging Face)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>Groq, Gemini & OpenAI providers</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>VoiceBridge Knowledge Engine (Offline Mode)</span>
            </li>
          </ul>
        </div>

        {/* Timbre Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
            <Volume2 size={24} />
          </div>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
            Text-to-Speech
          </span>
          <h3 className="text-xl font-bold text-slate-800 mt-1 mb-2">
            Gnani Timbre V3.0
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Studio-quality neural voice synthesis generating 48kHz linear PCM WAV speech. Delivers expressive nuance, natural prosody, and regional phoneme clarity for 10+ Indian languages.
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>Expressive voices (Shivani, Avinash)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>48,000 Hz Linear PCM audio quality</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-teal-600" />
              <span>Regional accent accuracy</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Language Matrix */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/90 shadow-card">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <Globe size={14} />
            <span>Indic Linguistic Coverage</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            10 Sovereign Indian Languages Supported
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Seamlessly switch between native Indian scripts or allow Prisma V3.0 to auto-detect your spoken tongue.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">{lang.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{lang.code}</span>
              </div>
              <p className="text-sm font-semibold text-blue-600 mb-1">{lang.script}</p>
              <p className="text-[11px] text-slate-500 italic truncate" title={lang.sample}>
                "{lang.sample}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official API Documentation Summary */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-700">
          <div>
            <h4 className="text-lg font-bold">Official Gnani AI Integration Architecture</h4>
            <p className="text-xs text-slate-300 mt-1">
              Zero invented endpoints. Implemented strictly according to official Gnani.ai developer documentation.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-teal-300">
            <span>Base URL:</span>
            <span>https://api.vachana.ai</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-blue-400 font-bold block">// Gnani Prisma V3.0 (STT)</span>
            <p><span className="text-slate-400">Endpoint:</span> POST https://api.vachana.ai/stt/v3</p>
            <p><span className="text-slate-400">Header:</span> X-API-Key-ID: &lt;GNANI_API_KEY&gt;</p>
            <p><span className="text-slate-400">Payload:</span> multipart/form-data (audio_file, model=prisma-v3.0, language_code=indic-auto)</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-teal-400 font-bold block">// Gnani Timbre V3.0 (TTS)</span>
            <p><span className="text-slate-400">Endpoint:</span> POST https://api.vachana.ai/api/v1/tts/inference</p>
            <p><span className="text-slate-400">Header:</span> X-API-Key-ID: &lt;GNANI_API_KEY&gt;</p>
            <p><span className="text-slate-400">Payload:</span> JSON (text, voice=Shivani, model=timbre-v3.0, language=hi-IN, container=wav)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

