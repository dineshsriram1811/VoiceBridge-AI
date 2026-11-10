import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, Loader2, Mic } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatInterface({
  messages,
  onSendMessage,
  onClearConversation,
  onOpenVoiceModal,
  loadingState,
  disabled = false
}) {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const starterPrompts = [
    { text: 'नमस्ते! आप मेरी क्या सहायता कर सकते हैं?', lang: 'हिंदी' },
    { text: 'Tell me about the benefits of sovereign AI for Indian languages.', lang: 'English' },
    { text: 'வணக்கம்! எனக்கு இன்று வானிலை எப்படி உள்ளது?', lang: 'தமிழ்' },
    { text: 'భారతదేశ సాంస్కృతిక వారసత్వం గురించి చెప్పండి.', lang: 'తెలుగు' }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
          <h2 className="text-sm font-bold text-slate-800">VoiceBridge Dialogue Session</h2>
          <span className="text-xs text-slate-400 font-normal">({messages.length} messages)</span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearConversation}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-teal-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
              <Sparkles size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Start a Conversation in Your Language
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6">
              Speak or type in Hindi, Tamil, Telugu, Kannada, Bengali, English, or any Indian language. Powered by Gnani Prisma V3.0 (STT) and Gnani Timbre V3.0 (TTS).
            </p>

            {/* Quick starter chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {starterPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(p.text)}
                  className="p-3 text-left bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-200 rounded-xl transition-all group"
                >
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block mb-0.5">
                    {p.lang}
                  </span>
                  <p className="text-xs text-slate-700 group-hover:text-blue-900 line-clamp-2">
                    "{p.text}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}

        {/* Loading / Pipeline In-Flight State */}
        {loadingState && (
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl my-3 text-xs text-blue-700 animate-pulse">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            <span className="font-medium">{loadingState}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 md:p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 p-1.5 shadow-sm transition-all">
          {/* Quick Voice Trigger */}
          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Switch to Voice Mode"
          >
            <Mic size={18} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message in Hindi, English, Tamil, Telugu..."
            disabled={disabled}
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || disabled}
            className={`p-2 rounded-lg text-white transition-all ${
              inputText.trim() && !disabled
                ? 'bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-95'
                : 'bg-slate-300 cursor-not-allowed text-slate-500'
            }`}
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          Gnani Prisma V3.0 (STT) • Gnani Timbre V3.0 (TTS) • VoiceBridge AI
        </p>
      </form>
    </div>
  );
}

