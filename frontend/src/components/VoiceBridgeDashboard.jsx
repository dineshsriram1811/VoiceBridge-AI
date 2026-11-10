import React, { useState } from 'react';
import { Mic, UploadCloud, MessageSquare, Sparkles, Volume2, Globe, FileText, CheckCircle2 } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import AudioUploader from './AudioUploader';
import ChatInterface from './ChatInterface';
import { apiService } from '../services/apiService';

export default function VoiceBridgeDashboard({
  settings,
  serverConfig,
  onOpenSettings
}) {
  const [activeInputMode, setActiveInputMode] = useState('mic'); // 'mic' | 'upload'
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'नमस्ते! मैं वॉयसब्रिज एआई (VoiceBridge AI) हूँ। मैं ग्यानी एआई (Gnani AI) के प्रिस्मा वी3.0 और टिम्ब्रे वी3.0 द्वारा संचालित हूँ। आप मुझसे किसी भी भाषा में प्रश्न पूछ सकते हैं।',
      language: 'hi-IN',
      reasoningModel: 'VoiceBridge AI',
      ttsVoice: settings.voice || 'Shivani',
      timestamp: new Date().toISOString()
    }
  ]);
  const [loadingState, setLoadingState] = useState(null);
  const [latestTranscript, setLatestTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  /**
   * Handle Audio Input (Microphone recording or Uploaded file)
   */
  const handleAudioInput = async (audioBlob) => {
    try {
      setLoadingState('Transcribing speech with Gnani Prisma V3.0...');
      setLatestTranscript('');
      setDetectedLanguage(null);

      // Perform full end-to-end pipeline via backend
      const result = await apiService.processVoicePipeline(audioBlob, {
        language_code: settings.language,
        voice: settings.voice,
        stt_model: settings.sttModel,
        tts_model: 'timbre-v3.0',
        speed: settings.speed
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to process voice query');
      }

      setLatestTranscript(result.transcript);
      setDetectedLanguage(result.detectedLanguage);

      const userMessageId = `user-${Date.now()}`;
      const assistantMessageId = `assistant-${Date.now()}`;

      // Add user transcribed message
      const userMsg = {
        id: userMessageId,
        sender: 'user',
        text: result.transcript || '(Unclear speech recorded)',
        language: result.detectedLanguage,
        isVoice: true,
        timestamp: new Date().toISOString()
      };

      // Add assistant response message with Timbre audio
      const assistantMsg = {
        id: assistantMessageId,
        sender: 'assistant',
        text: result.responseText,
        language: result.detectedLanguage,
        audioBase64: result.audioBase64,
        reasoningModel: result.reasoningModel,
        reasoningProvider: result.reasoningProvider,
        ttsVoice: result.ttsVoice,
        autoPlay: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMsg, assistantMsg]);
    } catch (error) {
      console.error('Voice pipeline error:', error);
      alert(`Error processing voice: ${error.message}`);
    } finally {
      setLoadingState(null);
    }
  };

  /**
   * Handle Text Query
   */
  const handleSendTextMessage = async (text) => {
    try {
      const userMessageId = `user-${Date.now()}`;
      const userMsg = {
        id: userMessageId,
        sender: 'user',
        text: text,
        language: settings.language,
        isVoice: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMsg]);
      
      const providerLabel = serverConfig?.activeReasoningProvider || 'AI';
      setLoadingState(`${providerLabel} is reasoning your query...`);

      // Step 1: Send query to Reasoning Model with conversation history
      const chatResult = await apiService.sendChatMessage(text, {
        language: settings.language,
        history: messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      });

      if (!chatResult.success) {
        throw new Error(chatResult.error || 'Failed to get answer from reasoning service');
      }

      const responseText = chatResult.responseText;
      const respLanguage = chatResult.language || settings.language;

      // Step 2: Convert response text to speech using Gnani Timbre V3.0
      setLoadingState('Synthesizing speech with Gnani Timbre V3.0...');
      let audioBase64 = null;
      try {
        const ttsResult = await apiService.synthesizeSpeech(responseText, {
          voice: settings.voice,
          model: 'timbre-v3.0',
          language: respLanguage === 'indic-auto' ? 'en-IN' : respLanguage,
          speed: settings.speed
        });
        audioBase64 = ttsResult.audioBase64;
      } catch (ttsErr) {
        console.warn('TTS Synthesis failed or skipped:', ttsErr.message);
      }

      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMsg = {
        id: assistantMessageId,
        sender: 'assistant',
        text: responseText,
        language: respLanguage,
        audioBase64: audioBase64,
        reasoningModel: chatResult.model,
        reasoningProvider: chatResult.provider,
        ttsVoice: settings.voice,
        autoPlay: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      alert(`Error generating response: ${error.message}`);
    } finally {
      setLoadingState(null);
    }
  };

  const handleClearConversation = () => {
    if (window.confirm('Are you sure you want to clear this conversation history?')) {
      setMessages([]);
      setLatestTranscript('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Voice Input & Transcription Hub (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mode Switcher */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <button
              onClick={() => setActiveInputMode('mic')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeInputMode === 'mic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic size={16} />
              <span>Record Voice (Mic)</span>
            </button>

            <button
              onClick={() => setActiveInputMode('upload')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeInputMode === 'upload'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud size={16} />
              <span>Upload Audio File</span>
            </button>
          </div>

          {/* Interactive Input Component */}
          {activeInputMode === 'mic' ? (
            <AudioRecorder
              onRecordingComplete={handleAudioInput}
              disabled={Boolean(loadingState)}
            />
          ) : (
            <AudioUploader
              onAudioUploaded={handleAudioInput}
              disabled={Boolean(loadingState)}
            />
          )}

          {/* Live Transcription Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Prisma V3.0 Transcription
                </h3>
              </div>
              {detectedLanguage && (
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[11px] font-semibold border border-teal-200 flex items-center gap-1">
                  <Globe size={11} />
                  {detectedLanguage}
                </span>
              )}
            </div>

            {latestTranscript ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  "{latestTranscript}"
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-teal-600">
                  <CheckCircle2 size={12} />
                  <span>Speech-to-text successfully transcribed</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-3 text-center">
                Spoken or uploaded audio transcripts will appear here in real-time.
              </p>
            )}
          </div>

          {/* Active Model Stack Quick Info */}
          <div className="bg-gradient-to-tr from-blue-50 to-teal-50/50 rounded-2xl p-4 border border-blue-100 text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Active Voice:</span>
              <span className="font-medium text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                {settings.voice} (Timbre v3.0)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Speech Rate:</span>
              <span className="font-mono text-slate-800">{settings.speed}x</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Target Language:</span>
              <span className="font-medium text-slate-800">{settings.language}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat & Spoken Responses (7 columns) */}
        <div className="lg:col-span-7 h-[680px]">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendTextMessage}
            onClearConversation={handleClearConversation}
            onOpenVoiceModal={() => setActiveInputMode('mic')}
            loadingState={loadingState}
            disabled={Boolean(loadingState)}
          />
        </div>
      </div>
    </div>
  );
}

