import React, { useState } from 'react';
import { Bot, User, Copy, Check, Volume2, Sparkles, Clock, Globe } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

export default function MessageBubble({ message, onPlayAudio }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
          <Bot size={18} />
        </div>
      )}

      {/* Message Content Container */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Sender & Metadata Tags */}
        <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
          <span className="font-semibold">{isUser ? 'You' : 'VoiceBridge AI'}</span>
          <span>•</span>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <Clock size={10} />
            {formatTimestamp(message.timestamp)}
          </span>
          {message.language && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium flex items-center gap-0.5 border border-slate-200">
              <Globe size={10} />
              {message.language}
            </span>
          )}
          {message.isVoice && (
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium flex items-center gap-0.5">
              <Volume2 size={10} />
              Voice
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl p-4 shadow-sm relative group transition-all ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-card'
          }`}
        >
          {/* Text Content */}
          <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className={`absolute top-2 right-2 p-1.5 rounded-md transition-opacity opacity-0 group-hover:opacity-100 ${
              isUser
                ? 'hover:bg-blue-700 text-blue-100'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
            }`}
            title="Copy message"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>

          {/* AI Model Attribution Badges */}
          {!isUser && (message.reasoningModel || message.reasoningProvider || message.ttsVoice) && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
              {(message.reasoningProvider || message.reasoningModel) && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-medium border border-teal-100">
                  <Sparkles size={11} />
                  <span>{message.reasoningProvider ? `${message.reasoningProvider} • ${message.reasoningModel}` : message.reasoningModel}</span>
                </span>
              )}
              {message.ttsVoice && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                  <Volume2 size={11} />
                  <span>Timbre v3.0 ({message.ttsVoice})</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Audio Player for spoken responses */}
        {!isUser && message.audioBase64 && (
          <div className="w-full mt-2">
            <AudioPlayer audioSrc={message.audioBase64} autoPlay={message.autoPlay} />
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-1">
          <User size={18} />
        </div>
      )}
    </div>
  );
}

