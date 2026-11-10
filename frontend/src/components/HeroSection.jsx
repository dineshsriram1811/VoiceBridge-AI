import React from 'react';
import { Mic, Cpu, Volume2, ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';

export default function HeroSection({ onStartSpeaking, onSwitchToUpload }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 bg-gradient-to-b from-blue-50/60 via-[#F6F8FC] to-[#F6F8FC] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold mb-4 shadow-sm">
          <Sparkles size={13} className="text-blue-600" />
          <span>Live Gnani.ai Prisma V3.0 (STT) & Timbre V3.0 (TTS) Integration</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Next-Gen AI Voice Assistant for <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Indian Languages</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Speak naturally in Hindi, Tamil, Telugu, Kannada, Bengali, or English. VoiceBridge transcribes speech with Gnani Prisma V3.0, reasons through intelligent LLM architecture, and responds in lifelike neural voice using Gnani Timbre V3.0.
        </p>

        {/* Interactive Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onStartSpeaking}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Mic size={18} />
            <span>Start Voice Assistant</span>
          </button>

          <button
            onClick={onSwitchToUpload}
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm shadow-sm flex items-center gap-2 transition-all hover:border-blue-400"
          >
            <span>Upload Audio File</span>
          </button>
        </div>

        {/* Sovereign Architecture Workflow Pills */}
        <div className="mt-10 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Sovereign Indian Voice Processing Pipeline
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Mic size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">1. Prisma V3.0</p>
                <p className="text-[11px] text-slate-500">Multilingual STT & Auto Detect</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Cpu size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">2. Reasoning Engine</p>
                <p className="text-[11px] text-slate-500">Indic Context & Query Reasoning</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <Volume2 size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">3. Timbre V3.0</p>
                <p className="text-[11px] text-slate-500">Expressive Speech Synthesis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

