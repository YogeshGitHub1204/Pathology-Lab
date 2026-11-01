import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, RotateCcw, Check, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types/index.js';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  presetQuery?: string;
  onClearPresetQuery?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  presetQuery,
  onClearPresetQuery
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [leadSavedBadge, setLeadSavedBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or restore session
  useEffect(() => {
    let currentSession = localStorage.getItem('jeevan_chat_session_id');
    if (!currentSession) {
      currentSession = 'sess-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
      localStorage.setItem('jeevan_chat_session_id', currentSession);
    }
    setSessionId(currentSession);
    loadSessionHistory(currentSession);
  }, []);

  // When presetQuery is passed from "Inquire with Jeevan" button
  useEffect(() => {
    if (presetQuery && sessionId) {
      if (!isOpen) onOpen();
      // Send the query automatically or prepopulate input
      handleSendMessage(presetQuery);
      if (onClearPresetQuery) onClearPresetQuery();
    }
  }, [presetQuery, sessionId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadSessionHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/session/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // If empty, start with initial greeting
          startInitialGreeting();
        }
      } else {
        startInitialGreeting();
      }
    } catch {
      startInitialGreeting();
    }
  };

  const startInitialGreeting = () => {
    setMessages([
      {
        id: 'init',
        role: 'assistant',
        text: 'Namaste! Welcome to Jeevan Pathology Lab, Pune. I am Jeevan, your digital lab assistant. May I please know your full name?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    if (!textToSend) {
      setInputValue('');
    }

    const tempUserMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Brief typing simulation for natural feel
        setTimeout(() => {
          setMessages(data.session.messages);
          setIsTyping(false);

          if (data.leadSaved) {
            setLeadSavedBadge(true);
            setTimeout(() => setLeadSavedBadge(false), 4000);
          }
        }, 400);
      } else {
        setIsTyping(false);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    if (confirm('Start a fresh conversation with Jeevan?')) {
      const newSession = 'sess-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
      localStorage.setItem('jeevan_chat_session_id', newSession);
      setSessionId(newSession);
      startInitialGreeting();
    }
  };

  const handleClose = () => {
    // Notify server to save current state as lead
    if (sessionId) {
      fetch('/api/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      }).catch(() => {});
    }
    onClose();
  };

  return (
    <>
      {/* Floating Action Trigger Button when closed */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Open Chat with Jeevan"
          className="fixed bottom-6 right-6 z-50 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3.5 sm:px-5 sm:py-3.5 shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 group border-2 border-white/80"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-teal-600" />
          </div>
          <span className="hidden sm:inline font-semibold text-xs tracking-wide">
            Chat with Jeevan
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                J
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-tight text-white">Jeevan</h3>
                  <span className="text-[10px] text-teal-300 bg-teal-950/80 px-1.5 py-0.5 rounded font-medium border border-teal-800/60">
                    Lab Assistant
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Jeevan Pathology Lab, Pune
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lead Saved Notification Badge */}
          {leadSavedBadge && (
            <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-[11px] px-3 py-1.5 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Details saved! Pathology team alerted.</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600">Pune Desk</span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      isAssistant
                        ? 'bg-white text-slate-900 border border-slate-200 rounded-tl-sm'
                        : 'bg-teal-600 text-white rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-500 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-fit shadow-sm">
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Option Suggestion Chips */}
          <div className="bg-white border-t border-slate-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">Suggestions:</span>
            <button
              onClick={() => handleSendMessage('Complete Blood Count (CBC)')}
              className="text-[11px] font-medium text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 px-2 py-1 rounded border border-slate-200 whitespace-nowrap"
            >
              CBC Blood Test
            </button>
            <button
              onClick={() => handleSendMessage('Digital Chest X-Ray')}
              className="text-[11px] font-medium text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 px-2 py-1 rounded border border-slate-200 whitespace-nowrap"
            >
              Digital Chest X-Ray
            </button>
            <button
              onClick={() => handleSendMessage('What are the course fees?')}
              className="text-[11px] font-medium text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 px-2 py-1 rounded border border-slate-200 whitespace-nowrap"
            >
              Course Fees?
            </button>
            <button
              onClick={() => handleSendMessage('Urine Routine Test')}
              className="text-[11px] font-medium text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 px-2 py-1 rounded border border-slate-200 whitespace-nowrap"
            >
              Urine Routine
            </button>
            <button
              onClick={() => handleSendMessage('Tomorrow morning 8:30 AM')}
              className="text-[11px] font-medium text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 px-2 py-1 rounded border border-slate-200 whitespace-nowrap"
            >
              Tomorrow 8:30 AM
            </button>
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your reply to Jeevan..."
              disabled={isTyping}
              className="flex-1 text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 transition-colors shadow-sm"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
