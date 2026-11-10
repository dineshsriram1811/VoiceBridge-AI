import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VoiceBridgeDashboard from './components/VoiceBridgeDashboard';
import FeaturesOverview from './components/FeaturesOverview';
import AboutSection from './components/AboutSection';
import ModelSettingsModal from './components/ModelSettingsModal';
import { apiService } from './services/apiService';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'overview' | 'about'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [serverConfig, setServerConfig] = useState(null);

  const [settings, setSettings] = useState({
    language: 'indic-auto',
    voice: 'Shivani',
    speed: 1.0,
    sttModel: 'prisma-v3.0',
    ttsModel: 'timbre-v3.0'
  });

  useEffect(() => {
    // Fetch server configuration
    apiService.getConfig()
      .then(data => {
        setServerConfig(data);
        if (data.defaultLanguage) {
          setSettings(prev => ({ ...prev, language: data.defaultLanguage }));
        }
      })
      .catch(err => console.warn('Could not fetch server config:', err.message));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-slate-800">
      {/* Top Navigation */}
      <Navbar
        serverConfig={serverConfig}
        currentLanguage={settings.language}
        onChangeLanguage={(lang) => setSettings(prev => ({ ...prev, language: lang }))}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <>
            <HeroSection
              onStartSpeaking={() => {
                const el = document.getElementById('dashboard-view');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSwitchToUpload={() => {
                const el = document.getElementById('dashboard-view');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <div id="dashboard-view">
              <VoiceBridgeDashboard
                settings={settings}
                serverConfig={serverConfig}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </div>
          </>
        )}
        {activeTab === 'overview' && <FeaturesOverview />}
        {activeTab === 'about' && <AboutSection serverConfig={serverConfig} />}
      </main>

      {/* Settings Modal */}
      <ModelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        serverConfig={serverConfig}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">VoiceBridge AI</span>
            <span>•</span>
            <span>Indian Multilingual AI Voice Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by <strong className="text-blue-600">Gnani.ai</strong> (Prisma, Timbre, Evon)</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-teal-600" />
              Sovereign Indic Stack
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

