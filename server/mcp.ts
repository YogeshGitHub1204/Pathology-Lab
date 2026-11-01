import { Request, Response } from 'express';
import { db } from './db.js';

// Exact tool definitions and descriptions verbatim as requested
export const MCP_TOOLS = [
  {
    name: 'list_hot_leads',
    description: 'List leads labelled Hot, newest first, with name, course and phone.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_lead_summary',
    description: "Given a lead's name, return the saved summary and quality label.",
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: "The name of the lead"
        }
      },
      required: ['name']
    }
  },
  {
    name: 'draft_followup',
    description: "Given a lead's name, return the saved WhatsApp follow-up message.",
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: "The name of the lead"
        }
      },
      required: ['name']
    }
  }
];

// Helper to look up lead by name in existing database
function findLeadByName(name: string) {
  const cleanName = name.trim();
  // 1. Exact match (case insensitive)
  let lead = db.prepare(`
    SELECT * FROM leads 
    WHERE LOWER(TRIM(name)) = LOWER(?)
    ORDER BY created_at DESC 
    LIMIT 1
  `).get(cleanName) as any;

  // 2. Fuzzy partial match if exact match not found
  if (!lead) {
    lead = db.prepare(`
      SELECT * FROM leads 
      WHERE LOWER(name) LIKE LOWER(?)
      ORDER BY created_at DESC 
      LIMIT 1
    `).get(`%${cleanName}%`) as any;
  }

  return lead;
}

// Tool 1: list_hot_leads
function handleListHotLeads() {
  const hotLeads = db.prepare(`
    SELECT name, test_or_course AS course, phone
    FROM leads
    WHERE label = 'Hot'
    ORDER BY created_at DESC
  `).all() as { name: string; course: string; phone: string }[];

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(hotLeads, null, 2)
      }
    ]
  };
}

// Tool 2: get_lead_summary
function handleGetLeadSummary(args: any) {
  if (!args || typeof args.name !== 'string' || !args.name.trim()) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: "Error: Required argument 'name' is missing or empty."
        }
      ]
    };
  }

  const name = args.name.trim();
  const lead = findLeadByName(name);

  if (!lead) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error: No lead found with name '${name}'.`
        }
      ]
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          name: lead.name,
          summary: lead.summary,
          label: lead.label
        }, null, 2)
      }
    ]
  };
}

// Tool 3: draft_followup
function handleDraftFollowup(args: any) {
  if (!args || typeof args.name !== 'string' || !args.name.trim()) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: "Error: Required argument 'name' is missing or empty."
        }
      ]
    };
  }

  const name = args.name.trim();
  const lead = findLeadByName(name);

  if (!lead) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error: No lead found with name '${name}'.`
        }
      ]
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: lead.follow_up_message
      }
    ]
  };
}

// Main MCP JSON-RPC Handler
export function handleMcpRequest(req: Request, res: Response) {
  const body = req.body;

  // Validate JSON-RPC 2.0 structure
  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: Request body must be a valid JSON object' }
    });
  }

  const { jsonrpc, id = null, method, params } = body;

  if (jsonrpc !== '2.0') {
    return res.status(400).json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: "Invalid Request: 'jsonrpc' must be '2.0'" }
    });
  }

  switch (method) {
    case 'initialize': {
      // Must return protocolVersion "2025-06-18"
      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2025-06-18',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'JeevanChat MCP Server',
            version: '1.0.0'
          }
        }
      });
    }

    case 'tools/list': {
      return res.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS
        }
      });
    }

    case 'tools/call': {
      if (!params || typeof params !== 'object' || !params.name) {
        return res.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: "Invalid params: 'name' is required in tools/call" }
        });
      }

      const toolName = params.name;
      const toolArgs = params.arguments || {};

      switch (toolName) {
        case 'list_hot_leads': {
          const result = handleListHotLeads();
          return res.json({
            jsonrpc: '2.0',
            id,
            result
          });
        }

        case 'get_lead_summary': {
          const result = handleGetLeadSummary(toolArgs);
          return res.json({
            jsonrpc: '2.0',
            id,
            result
          });
        }

        case 'draft_followup': {
          const result = handleDraftFollowup(toolArgs);
          return res.json({
            jsonrpc: '2.0',
            id,
            result
          });
        }

        default: {
          return res.json({
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Tool '${toolName}' not found` }
          });
        }
      }
    }

    default: {
      return res.json({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method '${method}' not found. Supported methods: initialize, tools/list, tools/call.` }
      });
    }
  }
}
