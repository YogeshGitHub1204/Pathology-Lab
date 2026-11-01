import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Filter,
  Phone,
  Calendar,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Settings,
  LogOut,
  X,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
  Send
} from 'lucide-react';
import { Lead, LeadLabel, LeadStatus, LabConfig, AdminUser } from '../../types/index.js';
import { AdminSettingsModal } from './AdminSettingsModal.js';

interface AdminDashboardProps {
  adminUser: AdminUser;
  authToken: string;
  config: LabConfig;
  onConfigUpdated: (newConfig: LabConfig) => void;
  onNavigateToCustomerChats: () => void;
  onNavigateToPublicSite: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  authToken,
  config,
  onConfigUpdated,
  onNavigateToCustomerChats,
  onNavigateToPublicSite,
  onLogout
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const q = encodeURIComponent(searchQuery);
      const url = `/api/admin/leads?label=${selectedLabel}&status=${selectedStatus}&search=${q}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        if (selectedLead) {
          const fresh = data.find((l: Lead) => l.id === selectedLead.id);
          if (fresh) {
            setSelectedLead(fresh);
            setNotesDraft(fresh.notes || '');
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedLabel, selectedStatus, searchQuery]);

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesDraft(lead.notes || '');
  };

  const handleUpdateStatus = async (leadId: number, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ notes: notesDraft })
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Metric counts
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.label === 'Hot').length;
  const warmLeads = leads.filter((l) => l.label === 'Warm').length;
  const coldLeads = leads.filter((l) => l.label === 'Cold').length;

  // Exact Badge Colors as required: Hot in red, Warm in orange, Cold in blue
  const renderLabelBadge = (label: LeadLabel) => {
    switch (label) {
      case 'Hot':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Hot
          </span>
        );
      case 'Warm':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Warm
          </span>
        );
      case 'Cold':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            Cold
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-base">
                J
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                JeevanChat Admin
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
              Pune Desk ({adminUser.email})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCustomerChats}
              className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>Customer Chats</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-teal-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={onNavigateToPublicSite}
              className="text-xs font-medium text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Total Leads Captured</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1 tabular-nums">
              {totalLeads}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm">
            <span className="text-xs font-bold text-rose-700">Hot Leads (Urgent)</span>
            <div className="text-2xl font-black text-rose-700 font-mono mt-1 tabular-nums">
              {hotLeads}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm">
            <span className="text-xs font-bold text-amber-700">Warm Leads (Inquiry)</span>
            <div className="text-2xl font-black text-amber-700 font-mono mt-1 tabular-nums">
              {warmLeads}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-sky-200 shadow-sm">
            <span className="text-xs font-bold text-sky-700">Cold Leads (Partial)</span>
            <div className="text-2xl font-black text-sky-700 font-mono mt-1 tabular-nums">
              {coldLeads}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Label Tabs: All, Hot (Red), Warm (Orange), Cold (Blue) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['All', 'Hot', 'Warm', 'Cold'] as const).map((lbl) => {
              const active = selectedLabel === lbl;
              return (
                <button
                  key={lbl}
                  onClick={() => setSelectedLabel(lbl)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                    active
                      ? lbl === 'Hot'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : lbl === 'Warm'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : lbl === 'Cold'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lbl === 'All' ? 'All Leads' : `${lbl} Leads`}
                </button>
              );
            })}
          </div>

          {/* Search Input & Status Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, test..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={fetchLeads}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th scope="col" className="px-5 py-3">Patient / Visitor Name</th>
                  <th scope="col" className="px-5 py-3">Phone</th>
                  <th scope="col" className="px-5 py-3">Requested Test / Course</th>
                  <th scope="col" className="px-5 py-3">Preferred Timing</th>
                  <th scope="col" className="px-5 py-3">Date</th>
                  <th scope="col" className="px-5 py-3 text-center">Label</th>
                  <th scope="col" className="px-5 py-3 text-center">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                      Loading leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                      No leads match current filters.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenLead(lead)}
                      className={`cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {lead.name}
                      </td>

                      <td className="px-5 py-3.5 font-mono text-slate-700 whitespace-nowrap">
                        {lead.phone}
                      </td>

                      <td className="px-5 py-3.5 text-slate-700 max-w-xs truncate" title={lead.test_or_course}>
                        {lead.test_or_course}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {lead.preferred_timing}
                      </td>

                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap font-mono tabular-nums">
                        {new Date(lead.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {renderLabelBadge(lead.label)}
                      </td>

                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          lead.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : lead.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-700'
                            : lead.status === 'Contacted'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLead(lead);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Slide-over Modal: Lead Detail, 2-3 Line Summary, Full Transcript, and WhatsApp Follow-Up */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-sm">
                  {selectedLead.name.charAt(0) || 'L'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{selectedLead.name}</h3>
                    {renderLabelBadge(selectedLead.label)}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedLead.phone} · ID #{selectedLead.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* 2-3 Line Summary Callout */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>2-3 Line Lead Summary</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedLead.summary}
                </p>
              </div>

              {/* Structured Key Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-slate-400">Requested Test or Course:</span>
                  <div className="font-bold text-slate-900">{selectedLead.test_or_course}</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-slate-400">Preferred Timing:</span>
                  <div className="font-bold text-slate-900">{selectedLead.preferred_timing}</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-slate-400">Captured Timestamp:</span>
                  <div className="font-mono text-slate-800">{new Date(selectedLead.created_at).toLocaleString()}</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-slate-400">Workflow Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as LeadStatus)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2 py-1 mt-0.5"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Ready-to-copy Follow-Up Message */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-teal-700" />
                    <span>Ready-to-Copy Follow-Up Message (WhatsApp / SMS)</span>
                  </span>
                  
                  <button
                    onClick={() => copyToClipboard(selectedLead.follow_up_message, 'modal-followup')}
                    className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 bg-white hover:bg-teal-100/60 border border-teal-200 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedId === 'modal-followup' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-white rounded-lg border border-teal-200/80 text-xs text-slate-800 select-all font-sans leading-relaxed">
                  {selectedLead.follow_up_message}
                </div>

                {selectedLead.phone && (
                  <div className="flex justify-end pt-1">
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(selectedLead.follow_up_message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Directly on WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Full Chat Transcript */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Full Chat Transcript ({selectedLead.chat_transcript.length} turns)
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Session: {selectedLead.session_id}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-72 overflow-y-auto space-y-3">
                  {selectedLead.chat_transcript.map((msg) => {
                    const isAssistant = msg.role === 'assistant';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                      >
                        <div className="text-[10px] font-semibold text-slate-400 mb-0.5 px-1">
                          {isAssistant ? 'Assistant Jeevan' : selectedLead.name}
                        </div>
                        <div
                          className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                            isAssistant
                              ? 'bg-white text-slate-800 border border-slate-200'
                              : 'bg-teal-600 text-white'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Internal Staff Notes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Internal Lab Notes
                </h4>
                <textarea
                  rows={2}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add notes about sample collection, home visit, doctor prescription..."
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-800 hover:text-teal-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onConfigUpdated={onConfigUpdated}
        authToken={authToken}
      />

    </div>
  );
};
