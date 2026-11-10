import React from 'react';
import { ShieldCheck, Cpu, Mic, Volume2, Globe, Lock, Layers, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutSection({ serverConfig }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <ShieldCheck size={14} className="text-blue-600" />
          <span>Sovereign Indian Voice AI Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">VoiceBridge AI</span>
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          VoiceBridge AI is a full-stack, enterprise-grade multilingual voice assistant application engineered to bridge communication across India's regional languages. It combines official <strong>Gnani.ai</strong> voice models with modern conversational reasoning.
        </p>
      </div>

      {/* 3-Stage Core Architecture */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-card space-y-8">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Layers size={20} className="text-blue-600" />
          <span>End-to-End Voice Architecture Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1 */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3 shadow-sm shadow-blue-500/20">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Speech-to-Text (STT)
              </h4>
              <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block mb-2">
                Gnani Prisma V3.0
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures user speech via in-browser 16-bit PCM WAV recording or file upload. Transcribes audio via official Gnani Prisma endpoint (<code className="text-blue-700 font-mono text-[10px]">https://api.vachana.ai/stt/v3</code>) with automatic language detection (<code className="text-blue-700 font-mono text-[10px]">indic-auto</code>) and code-mixing support.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-100/80 text-[11px] font-medium text-blue-700 flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Live Gnani Integration</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 shadow-sm shadow-indigo-500/20">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Reasoning & Context
              </h4>
              <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block mb-2">
                Multi-LLM & Offline Engine
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Processes user query with multi-turn conversation history. Supports self-hosted <strong>Gnani Evon</strong> (v3.3-30B-A3B) via vLLM, high-speed cloud LLMs (Groq, Google Gemini, OpenAI), or the built-in <strong>VoiceBridge Knowledge Engine (Offline Mode)</strong> when external keys are not set.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100/80 text-[11px] font-medium text-indigo-700 flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Zero False Attribution</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold mb-3 shadow-sm shadow-teal-500/20">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Text-to-Speech (TTS)
              </h4>
              <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block mb-2">
                Gnani Timbre V3.0
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Converts the reasoned response text into fluid, expressive neural speech using Gnani Timbre (<code className="text-teal-700 font-mono text-[10px]">https://api.vachana.ai/api/v1/tts/inference</code>). Delivers high-definition 48,000 Hz Linear PCM audio with custom speed controls.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-100/80 text-[11px] font-medium text-teal-700 flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Live Gnani Integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Sovereign Architecture Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <Lock size={20} />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">
            Enterprise Security & Key Isolation
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            API keys (including <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">GNANI_API_KEY</code>, <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">GROQ_API_KEY</code>, and <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">GEMINI_API_KEY</code>) are exclusively loaded in the backend environment. No sensitive secrets or tokens are ever exposed to the client or browser bundle.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Verified Safeguards:</p>
            <p>✓ All external API calls occur server-side</p>
            <p>✓ Multer memory-storage streams audio without persistent disk retention</p>
            <p>✓ CORS protection & rate limiting</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Globe size={20} />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">
            Indic Linguistic Grounding
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            VoiceBridge AI natively understands and generates speech across 10 official Indian languages plus Indian English. It handles regional phonemes, code-mixed dialects (Hinglish, Tanglish), and cultural nuances seamlessly.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800">Northern & Western:</span>
              <p className="text-[11px] text-slate-500">Hindi, Marathi, Gujarati, Punjabi</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-800">Southern & Eastern:</span>
              <p className="text-[11px] text-slate-500">Tamil, Telugu, Kannada, Bengali, Malayalam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

