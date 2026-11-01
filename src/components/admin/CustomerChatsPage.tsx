import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, ArrowLeft, Clock, User, Phone, Calendar, RefreshCw, Send, Check } from 'lucide-react';
import { ChatSessionItem, LeadLabel } from '../../types/index.js';

interface CustomerChatsPageProps {
  authToken: string;
  onBackToDashboard: () => void;
  onLogout: () => void;
}

export const CustomerChatsPage: React.FC<CustomerChatsPageProps> = ({
  authToken,
  onBackToDashboard,
  onLogout
}) => {
  const [chats, setChats] = useState<ChatSessionItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSessionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const q = encodeURIComponent(searchQuery);
      const res = await fetch(`/api/admin/chats?search=${q}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0]);
        } else if (selectedChat) {
          // Keep current selected updated
          const updated = data.find((c: ChatSessionItem) => c.sessionId === selectedChat.sessionId);
          if (updated) setSelectedChat(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load customer chats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [searchQuery]);

  const getLabelBadge = (label: LeadLabel) => {
    switch (label) {
      case 'Hot':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Hot Lead
          </span>
        );
      case 'Warm':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Warm Lead
          </span>
        );
      case 'Cold':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            Cold Lead
          </span>
        );
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Leads</span>
            </button>
            <div className="h-5 w-px bg-slate-700" />
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>Customer Chat Histories</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchChats}
              className="text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              title="Refresh Chat Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Left Sessions List, Right Chat Transcript */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: List of All Customer Chat Sessions */}
        <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[750px] overflow-hidden">
          
          {/* Search Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                All Customer Sessions ({chats.length})
              </h2>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search visitor, phone, or msg..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
              />
            </div>
          </div>

          {/* List of Sessions */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading customer chats...</div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No customer chats match "{searchQuery}".
              </div>
            ) : (
              chats.map((c) => {
                const isSelected = selectedChat?.sessionId === c.sessionId;
                return (
                  <div
                    key={c.sessionId}
                    onClick={() => setSelectedChat(c)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-teal-50/70 border-l-4 border-teal-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {c.visitorName}
                      </span>
                      {getLabelBadge(c.label)}
                    </div>

                    <div className="text-[11px] text-slate-600 truncate mb-1">
                      {c.testOrCourse || 'General diagnostic inquiry'}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{c.visitorPhone}</span>
                      <div className="flex items-center gap-1">
                        <span>{c.messageCount} msgs</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Transcript & Actions */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[750px] overflow-hidden">
          {selectedChat ? (
            <>
              {/* Transcript Header */}
              <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedChat.visitorName}
                    </h3>
                    {getLabelBadge(selectedChat.label)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-mono text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedChat.visitorPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(selectedChat.createdAt).toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      ID: {selectedChat.sessionId}
                    </span>
                  </div>
                </div>

                {selectedChat.visitorPhone && selectedChat.visitorPhone !== 'N/A' && (
                  <a
                    href={`https://wa.me/${selectedChat.visitorPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp Lead</span>
                  </a>
                )}
              </div>

              {/* Inquiry Summary Bar */}
              <div className="bg-slate-100/70 px-6 py-2.5 border-b border-slate-200 text-xs flex flex-wrap items-center gap-6 text-slate-700">
                <div>
                  <span className="text-slate-400">Requested Test/Course:</span>{' '}
                  <span className="font-semibold text-slate-900">{selectedChat.testOrCourse}</span>
                </div>
                <div>
                  <span className="text-slate-400">Preferred Timing:</span>{' '}
                  <span className="font-semibold text-slate-900">{selectedChat.preferredTiming}</span>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {selectedChat.messages.map((m) => {
                  const isAssistant = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div className="text-[11px] font-semibold text-slate-500 mb-1 px-1">
                        {isAssistant ? 'Assistant Jeevan' : selectedChat.visitorName}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                          isAssistant
                            ? 'bg-white text-slate-900 border border-slate-200 rounded-tl-sm'
                            : 'bg-teal-700 text-white rounded-tr-sm'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Ready-to-copy Follow-up Message Footer */}
              {selectedChat.followUpMessage && (
                <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Ready Follow-Up Message for Pathology Staff:</span>
                    <button
                      onClick={() => copyToClipboard(selectedChat.followUpMessage!, 'followup')}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      {copiedId === 'followup' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <span>Copy Message</span>
                      )}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 select-all font-mono">
                    {selectedChat.followUpMessage}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold">Select a conversation from the left</p>
              <p className="text-xs text-slate-400 mt-1">View complete customer transcripts and exchange history</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
