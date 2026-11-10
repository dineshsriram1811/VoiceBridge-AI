import React from 'react';
import { X, Settings2, Key, Sliders, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export default function ModelSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  serverConfig
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">VoiceBridge AI Settings</h3>
              <p className="text-xs text-slate-500">Gnani AI Model Parameters & API Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* API Status Alert */}
        <div className={`p-4 rounded-xl border mb-6 text-xs flex items-start gap-3 ${
          serverConfig?.gnaniConfigured
            ? 'bg-teal-50 border-teal-200 text-teal-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          {serverConfig?.gnaniConfigured ? (
            <CheckCircle size={18} className="text-teal-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-semibold">
              {serverConfig?.gnaniConfigured
                ? 'Gnani AI Live API Connected'
                : 'Demo / Simulation Mode Active'}
            </p>
            <p className="leading-relaxed">
              {serverConfig?.gnaniConfigured
                ? 'Your backend is directly connected to official https://api.vachana.ai endpoints with live Prisma STT and Timbre TTS.'
                : 'To enable live inference, provide your GNANI_API_KEY in backend/.env. Simulated transcripts and speech are currently enabled for immediate interactive testing.'}
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Input Language (STT)
            </label>
            <select
              value={settings.language}
              onChange={(e) => onSaveSettings({ ...settings, language: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            >
              <option value="indic-auto">🇮🇳 Auto Detect (Prisma v3.0 Indic-Auto)</option>
              <option value="hi-IN">🇮🇳 Hindi (हिंदी)</option>
              <option value="en-IN">🇮🇳 Indian English</option>
              <option value="ta-IN">🇮🇳 Tamil (தமிழ்)</option>
              <option value="te-IN">🇮🇳 Telugu (తెలుగు)</option>
              <option value="kn-IN">🇮🇳 Kannada (ಕನ್ನಡ)</option>
              <option value="bn-IN">🇮🇳 Bengali (বাংলা)</option>
              <option value="mr-IN">🇮🇳 Marathi (मराठी)</option>
              <option value="gu-IN">🇮🇳 Gujarati (ગુજરાતી)</option>
              <option value="pa-IN">🇮🇳 Punjabi (ਪੰਜਾਬੀ)</option>
              <option value="ml-IN">🇮🇳 Malayalam (മലയാളം)</option>
            </select>
          </div>

          {/* Timbre Voice Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Timbre Voice (TTS)
            </label>
            <select
              value={settings.voice}
              onChange={(e) => onSaveSettings({ ...settings, voice: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            >
              <option value="Shivani">Shivani (Female, Timbre v3.0 Expressive) ★</option>
              <option value="Avinash">Avinash (Male, Timbre v3.0 Expressive)</option>
              <option value="Nalini">Nalini (Female, Timbre v2.5 Standard)</option>
              <option value="Deepak">Deepak (Male, Timbre v2.5 Standard)</option>
              <option value="Kaveri">Kaveri (Female, Timbre v2.5 Standard)</option>
            </select>
          </div>

          {/* Speech Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Speech Speed Rate
              </label>
              <span className="text-xs font-mono font-medium text-blue-600">{settings.speed}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={settings.speed}
              onChange={(e) => onSaveSettings({ ...settings, speed: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.8x (Slow)</span>
              <span>1.0x (Normal)</span>
              <span>1.4x (Fast)</span>
            </div>
          </div>

          {/* STT Model */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Prisma STT Model
            </label>
            <select
              value={settings.sttModel}
              onChange={(e) => onSaveSettings({ ...settings, sttModel: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            >
              <option value="prisma-v3.0">prisma-v3.0 (Multilingual with indic-auto & codemix)</option>
              <option value="prisma-v2.5">prisma-v2.5 (Standard single language)</option>
            </select>
          </div>

          {/* API Info & Documentation link */}
          <div className="pt-3 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Key size={14} className="text-blue-600" />
                <span>Backend API Configuration</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                GNANI_BASE_URL: https://api.vachana.ai<br />
                HEADER: X-API-Key-ID: &lt;your_key&gt;
              </p>
              <p className="text-[11px] text-slate-500">
                Gnani Evon: <span className="font-mono">gnani/gnani-evon-v3.3-30B-A3B</span> on Hugging Face.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

