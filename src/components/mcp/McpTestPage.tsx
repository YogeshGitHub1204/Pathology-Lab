import React, { useState } from 'react';
import { ArrowLeft, Terminal, Play, Check, AlertCircle, Copy, Cpu, BookOpen, Layers } from 'lucide-react';

interface McpTestPageProps {
  onBackToSite: () => void;
}

export const McpTestPage: React.FC<McpTestPageProps> = ({ onBackToSite }) => {
  // State for get_lead_summary tool
  const [summaryLeadName, setSummaryLeadName] = useState('Rahul Deshmukh');
  const [summaryResponse, setSummaryResponse] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // State for draft_followup tool
  const [followupLeadName, setFollowupLeadName] = useState('Rahul Deshmukh');
  const [followupResponse, setFollowupResponse] = useState<any>(null);
  const [isFollowupLoading, setIsFollowupLoading] = useState(false);

  // State for list_hot_leads tool
  const [hotLeadsResponse, setHotLeadsResponse] = useState<any>(null);
  const [isHotLeadsLoading, setIsHotLeadsLoading] = useState(false);

  // State for initialize / tools/list inspection
  const [initResponse, setInitResponse] = useState<any>(null);
  const [isInitLoading, setIsInitLoading] = useState(false);
  const [toolsListResponse, setToolsListResponse] = useState<any>(null);
  const [isToolsListLoading, setIsToolsListLoading] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generic JSON-RPC poster
  const callMcp = async (method: string, params?: any) => {
    const payload = {
      jsonrpc: '2.0',
      id: `req-${Date.now()}`,
      method,
      params
    };

    const res = await fetch('/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await res.json();
  };

  const handleRunInitialize = async () => {
    setIsInitLoading(true);
    try {
      const data = await callMcp('initialize', {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'McpTestUI', version: '1.0' }
      });
      setInitResponse(data);
    } catch (err: any) {
      setInitResponse({ error: err.message });
    } finally {
      setIsInitLoading(false);
    }
  };

  const handleRunToolsList = async () => {
    setIsToolsListLoading(true);
    try {
      const data = await callMcp('tools/list', {});
      setToolsListResponse(data);
    } catch (err: any) {
      setToolsListResponse({ error: err.message });
    } finally {
      setIsToolsListLoading(false);
    }
  };

  const handleRunListHotLeads = async () => {
    setIsHotLeadsLoading(true);
    try {
      const data = await callMcp('tools/call', {
        name: 'list_hot_leads',
        arguments: {}
      });
      setHotLeadsResponse(data);
    } catch (err: any) {
      setHotLeadsResponse({ error: err.message });
    } finally {
      setIsHotLeadsLoading(false);
    }
  };

  const handleRunGetLeadSummary = async (nameOverride?: string) => {
    const targetName = nameOverride !== undefined ? nameOverride : summaryLeadName;
    setIsSummaryLoading(true);
    try {
      const data = await callMcp('tools/call', {
        name: 'get_lead_summary',
        arguments: { name: targetName }
      });
      setSummaryResponse(data);
    } catch (err: any) {
      setSummaryResponse({ error: err.message });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleRunDraftFollowup = async (nameOverride?: string) => {
    const targetName = nameOverride !== undefined ? nameOverride : followupLeadName;
    setIsFollowupLoading(true);
    try {
      const data = await callMcp('tools/call', {
        name: 'draft_followup',
        arguments: { name: targetName }
      });
      setFollowupResponse(data);
    } catch (err: any) {
      setFollowupResponse({ error: err.message });
    } finally {
      setIsFollowupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lab Portal</span>
            </button>
            <div className="h-5 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <h1 className="text-sm font-bold text-white tracking-tight">
                Model Context Protocol (MCP) Test Suite
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
              Endpoint: /mcp
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Overview Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Streamable HTTP Transport · JSON-RPC 2.0
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                MCP Server Live Diagnostics
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunInitialize}
                disabled={isInitLoading}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5 text-teal-600" />
                <span>{isInitLoading ? 'Testing...' : 'Test initialize'}</span>
              </button>

              <button
                onClick={handleRunToolsList}
                disabled={isToolsListLoading}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>{isToolsListLoading ? 'Fetching...' : 'Test tools/list'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            This endpoint enables AI assistants to directly inspect Jeevan Pathology Lab's hot leads, customer summaries, and ready WhatsApp follow-up messages using the Model Context Protocol over HTTP POST to <code className="text-teal-700 font-mono font-semibold bg-teal-50 px-1 py-0.5 rounded">/mcp</code>.
          </p>

          {/* Quick Init / Tools List Output if triggered */}
          {(initResponse || toolsListResponse) && (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              {initResponse && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">initialize response:</span>
                  <pre className="p-3 bg-slate-900 text-teal-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40">
                    {JSON.stringify(initResponse, null, 2)}
                  </pre>
                </div>
              )}
              {toolsListResponse && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">tools/list response:</span>
                  <pre className="p-3 bg-slate-900 text-teal-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40">
                    {JSON.stringify(toolsListResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* The 3 Required Tools Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Exposed Tools & Live Execution
            </h3>
          </div>

          {/* Tool 1: list_hot_leads */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    list_hot_leads
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Tool #1</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 italic font-serif">
                  "List leads labelled Hot, newest first, with name, course and phone."
                </p>
              </div>

              <button
                onClick={handleRunListHotLeads}
                disabled={isHotLeadsLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isHotLeadsLoading ? 'Querying...' : 'Call list_hot_leads'}</span>
              </button>
            </div>

            {/* Live Response Viewer */}
            {hotLeadsResponse && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Live JSON Response from /mcp:</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(hotLeadsResponse, null, 2), 'tool1')}
                    className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    {copiedKey === 'tool1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'tool1' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-teal-200 font-mono text-xs rounded-xl overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                  {JSON.stringify(hotLeadsResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Tool 2: get_lead_summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    get_lead_summary
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Tool #2</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 italic font-serif">
                  "Given a lead's name, return the saved summary and quality label."
                </p>
              </div>

              <button
                onClick={() => handleRunGetLeadSummary()}
                disabled={isSummaryLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSummaryLoading ? 'Querying...' : 'Call get_lead_summary'}</span>
              </button>
            </div>

            {/* Input field for lead name */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Argument: <span className="font-mono text-teal-700">name</span> (string)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={summaryLeadName}
                  onChange={(e) => setSummaryLeadName(e.target.value)}
                  placeholder="Enter patient or lead name (e.g. Rahul Deshmukh)"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px] text-slate-500">
                <span className="font-medium shrink-0">Sample Leads:</span>
                {['Rahul Deshmukh', 'Pooja Kulkarni', 'Amit Joshi', 'Sneha Patil', 'Nonexistent Lead'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setSummaryLeadName(sample);
                      handleRunGetLeadSummary(sample);
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded text-slate-700 transition-colors shrink-0"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Response Viewer */}
            {summaryResponse && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Live JSON Response from /mcp:</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(summaryResponse, null, 2), 'tool2')}
                    className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    {copiedKey === 'tool2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'tool2' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-teal-200 font-mono text-xs rounded-xl overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                  {JSON.stringify(summaryResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Tool 3: draft_followup */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    draft_followup
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Tool #3</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 italic font-serif">
                  "Given a lead's name, return the saved WhatsApp follow-up message."
                </p>
              </div>

              <button
                onClick={() => handleRunDraftFollowup()}
                disabled={isFollowupLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isFollowupLoading ? 'Querying...' : 'Call draft_followup'}</span>
              </button>
            </div>

            {/* Input field for lead name */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Argument: <span className="font-mono text-teal-700">name</span> (string)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={followupLeadName}
                  onChange={(e) => setFollowupLeadName(e.target.value)}
                  placeholder="Enter patient or lead name (e.g. Rahul Deshmukh)"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px] text-slate-500">
                <span className="font-medium shrink-0">Sample Leads:</span>
                {['Rahul Deshmukh', 'Pooja Kulkarni', 'Amit Joshi', 'Sneha Patil', 'Unknown Lead'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setFollowupLeadName(sample);
                      handleRunDraftFollowup(sample);
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded text-slate-700 transition-colors shrink-0"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Response Viewer */}
            {followupResponse && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Live JSON Response from /mcp:</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(followupResponse, null, 2), 'tool3')}
                    className="text-xs text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    {copiedKey === 'tool3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'tool3' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-teal-200 font-mono text-xs rounded-xl overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                  {JSON.stringify(followupResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>

      </main>

    </div>
  );
};
