import React from 'react';
import { Mic, Globe, Settings, Sparkles, Volume2, ShieldCheck } from 'lucide-react';

export default function Navbar({
  serverConfig,
  currentLanguage,
  onChangeLanguage,
  onOpenSettings,
  activeTab,
  onSelectTab
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Mic size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  VoiceBridge AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-200">
                  Gnani V3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Indian Multilingual Voice Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Voice Assistant
            </button>
            <button
              onClick={() => onSelectTab('overview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Technology & Specs
            </button>
            <button
              onClick={() => onSelectTab('about')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'about'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Quick Dropdown */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => onChangeLanguage(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer transition-colors"
                title="Select Spoken Language"
              >
                <option value="indic-auto">🇮🇳 Auto Detect (Indic-Auto)</option>
                <option value="hi-IN">🇮🇳 Hindi (हिंदी)</option>
                <option value="en-IN">🇮🇳 Indian English</option>
                <option value="ta-IN">🇮🇳 Tamil (தமிழ்)</option>
                <option value="te-IN">🇮🇳 Telugu (తెలుగు)</option>
                <option value="kn-IN">🇮🇳 Kannada (ಕನ್ನಡ)</option>
                <option value="bn-IN">🇮🇳 Bengali (বাংলা)</option>
                <option value="mr-IN">🇮🇳 Marathi (मराठी)</option>
                <option value="gu-IN">🇮🇳 Gujarati (ગુજરાતી)</option>
              </select>
            </div>

            {/* Gnani Live vs Simulated Status Dot */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                serverConfig?.gnaniConfigured
                  ? 'bg-teal-50 border-teal-200 text-teal-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
              title={
                serverConfig?.gnaniConfigured
                  ? 'Connected to live Gnani AI API'
                  : 'Running in simulation mode (Add GNANI_API_KEY in backend/.env)'
              }
            >
              <span className={`w-2 h-2 rounded-full ${
                serverConfig?.gnaniConfigured ? 'bg-teal-500' : 'bg-amber-500'
              }`} />
              <span>{serverConfig?.gnaniConfigured ? 'Gnani Live' : 'Demo Mode'}</span>
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-slate-200"
              title="Assistant Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

