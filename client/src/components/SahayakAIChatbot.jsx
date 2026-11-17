import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const SahayakAIChatbot = () => {
  const { t, currentLanguageObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: currentLanguageObj?.greeting || 'Namaste! I am the Sahayak AI Assistant. How can I assist you with campaigns, NGOs, or volunteer opportunities?',
      timestamp: new Date()
    }
  ]);

  // Update initial greeting message if user switches language and hasn't started chatting
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'ai' && currentLanguageObj?.greeting) {
      setMessages([
        {
          sender: 'ai',
          text: currentLanguageObj.greeting,
          timestamp: new Date()
        }
      ]);
    }
  }, [currentLanguageObj]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || loading) return;

    const userText = queryText.trim();
    setInput('');
    
    setMessages(prev => [...prev, { sender: 'user', text: userText, timestamp: new Date() }]);
    setLoading(true);

    try {
      const res = await api.aiChatbot(userText);
      if (res.success) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: res.reply,
          action: res.action,
          data: res.data,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: 'Sorry, I encountered an issue processing your query. Please try again.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: t('chatbot.reconnecting'),
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    sendQuery(input);
  };

  const quickPrompts = [
    t('chatbot.quickFindNgos'),
    t('chatbot.quickCampaigns'),
    t('chatbot.quickVolunteer'),
    t('chatbot.quickAid')
  ];

  return (
    <>
      {/* Floating Action Toggle Button - Clean & Minimal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 px-3.5 py-2.5 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 border border-indigo-500"
        title={t('chatbot.title')}
      >
        <Bot size={18} />
        <span className="text-xs font-semibold">{t('chatbot.assistant')}</span>
      </button>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-5 z-50 w-[92vw] sm:w-[380px] h-[500px] glass-card p-0 flex flex-col shadow-xl border border-[var(--border-color)] overflow-hidden animate-fadeIn rounded-xl">
          
          {/* Header */}
          <div className="p-3.5 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot size={15} />
              </div>
              <div>
                <div className="font-semibold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                  {t('chatbot.title')}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[10px] text-[var(--text-dim)]">{t('chatbot.subtitle')}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-[var(--bg-primary)]">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                )}
                
                <div className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-normal'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-[var(--text-muted)] text-[11px] italic p-1">
                <RefreshCw size={12} className="animate-spin text-indigo-500" />
                Processing request...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-1.5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendQuery(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-[var(--bg-primary)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--border-hover)] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2.5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentLanguageObj?.placeholder || t('chatbot.inputPlaceholder')}
              className="input-field text-xs py-1.5 rounded"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="btn btn-primary px-3 py-1.5 rounded disabled:opacity-50 text-xs"
              title={t('chatbot.send')}
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
