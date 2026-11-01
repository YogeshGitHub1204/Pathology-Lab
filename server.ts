import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { db, initializeDatabase, hashPassword, verifyPassword } from './server/db.js';
import { getOrCreateSession, processUserMessage, syncLeadRecord, saveSessionToDb } from './server/chatEngine.js';
import { handleMcpRequest } from './server/mcp.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize SQLite database, schema, and seed data
initializeDatabase();

app.use(express.json());
app.use(cookieParser());

// Simple logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/mcp') {
    console.log(`[HTTP] ${req.method} ${req.path}`);
  }
  next();
});

// ====================================================================
// MODEL CONTEXT PROTOCOL (MCP) ENDPOINT
// ====================================================================
// Unauthenticated, streamable HTTP transport with CORS support
app.use('/mcp', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, mcp-session-id');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.post('/mcp', handleMcpRequest);

// ====================================================================
// AUTH MIDDLEWARE
// ====================================================================
function getSessionToken(req: Request): string | null {
  if (req.cookies && req.cookies.admin_session) {
    return req.cookies.admin_session;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = getSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  const session = db.prepare(`
    SELECT s.token, s.user_id, s.email, s.expires_at, u.name
    FROM admin_sessions s
    JOIN admin_users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as any;

  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  (req as any).adminUser = {
    id: session.user_id,
    email: session.email,
    name: session.name
  };

  next();
}

// ====================================================================
// PUBLIC API: LAB CONFIGURATION & TESTS
// ====================================================================
app.get('/api/config', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT key, value FROM lab_config').all() as { key: string; value: string }[];
    const config: Record<string, string> = {};
    for (const r of rows) {
      config[r.key] = r.value;
    }
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// PUBLIC API: CHAT ASSISTANT "JEEVAN"
// ====================================================================

// Send a message to Jeevan
app.post('/api/chat/message', (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || typeof message !== 'string') {
      return res.status(400).json({ error: 'sessionId and message string are required' });
    }

    const session = getOrCreateSession(sessionId);
    const result = processUserMessage(session, message);

    res.json({
      reply: result.reply,
      session: {
        sessionId: result.session.sessionId,
        name: result.session.name,
        phone: result.session.phone,
        testOrCourse: result.session.testOrCourse,
        preferredTiming: result.session.preferredTiming,
        step: result.session.step,
        isCompleted: result.session.isCompleted,
        messages: result.session.messages
      },
      leadSaved: result.leadSaved
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get current session history
app.get('/api/chat/session/:sessionId', (req: Request, res: Response) => {
  try {
    const session = getOrCreateSession(req.params.sessionId);
    res.json({
      sessionId: session.sessionId,
      name: session.name,
      phone: session.phone,
      testOrCourse: session.testOrCourse,
      preferredTiming: session.preferredTiming,
      step: session.step,
      isCompleted: session.isCompleted,
      messages: session.messages
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Explicit end of conversation (e.g. user closes widget or says goodbye)
app.post('/api/chat/end', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = getOrCreateSession(sessionId);
    session.isCompleted = true;
    saveSessionToDb(session);
    const saved = syncLeadRecord(session);

    res.json({ success: true, leadSaved: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// ADMIN AUTHENTICATION API
// ====================================================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email.trim().toLowerCase()) as any;
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const valid = verifyPassword(password, admin.password_hash, admin.salt);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate secure 30-day session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO admin_sessions (token, user_id, email, created_at, expires_at)
      VALUES (?, ?, ?, datetime('now'), ?)
    `).run(token, admin.id, admin.email, expiresAt);

    // Set cookie
    res.cookie('admin_session', token, {
      httpOnly: true,
      secure: false, // works in dev & iframe
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login process failed' });
  }
});

// Check Admin Session Status
app.get('/api/admin/session', (req: Request, res: Response) => {
  const token = getSessionToken(req);
  if (!token) {
    return res.json({ authenticated: false });
  }

  const session = db.prepare(`
    SELECT s.token, s.user_id, s.email, u.name
    FROM admin_sessions s
    JOIN admin_users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as any;

  if (!session) {
    return res.json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: {
      id: session.user_id,
      email: session.email,
      name: session.name
    }
  });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const token = getSessionToken(req);
  if (token) {
    db.prepare('DELETE FROM admin_sessions WHERE token = ?').run(token);
  }
  res.clearCookie('admin_session');
  res.json({ success: true });
});

// Change Admin Password
app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).adminUser;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(adminUser.id) as any;
    const isCurrentValid = verifyPassword(currentPassword, admin.password_hash, admin.salt);
    if (!isCurrentValid) {
      return res.status(400).json({ error: 'Current password does not match' });
    }

    const { hash, salt } = hashPassword(newPassword);
    db.prepare(`
      UPDATE admin_users SET password_hash = ?, salt = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(hash, salt, adminUser.id);

    res.json({ success: true, message: 'Admin password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// ADMIN LEADS MANAGEMENT API
// ====================================================================

// List Leads with optional filter & search
app.get('/api/admin/leads', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { label, search, status } = req.query;

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];

    if (label && label !== 'All') {
      query += ' AND label = ?';
      params.push(label);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && typeof search === 'string') {
      query += ' AND (name LIKE ? OR phone LIKE ? OR test_or_course LIKE ? OR preferred_timing LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const leads = db.prepare(query).all(...params) as any[];

    // Parse transcripts for client convenience
    const formatted = leads.map(l => {
      let transcript = [];
      try {
        transcript = JSON.parse(l.chat_transcript);
      } catch {
        transcript = [];
      }
      return {
        ...l,
        chat_transcript: transcript
      };
    });

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single lead detail
app.get('/api/admin/leads/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id) as any;
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    let transcript = [];
    try {
      transcript = JSON.parse(lead.chat_transcript);
    } catch {
      transcript = [];
    }

    res.json({
      ...lead,
      chat_transcript: transcript
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update lead status and internal notes
app.patch('/api/admin/leads/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status, notes, label } = req.body;
    const leadId = req.params.id;

    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (label !== undefined && ['Hot', 'Warm', 'Cold'].includes(label)) {
      updates.push('label = ?');
      params.push(label);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    updates.push("updated_at = datetime('now')");
    params.push(leadId);

    db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// ADMIN CUSTOMER CHATS PAGE API
// ====================================================================

// List all customer chat histories (searchable and filterable)
app.get('/api/admin/chats', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT c.*, l.label, l.status as lead_status, l.follow_up_message
      FROM chat_sessions c
      LEFT JOIN leads l ON c.session_id = l.session_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search && typeof search === 'string') {
      query += ` AND (
        c.visitor_name LIKE ? OR
        c.visitor_phone LIKE ? OR
        c.test_or_course LIKE ? OR
        c.messages LIKE ?
      )`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY c.created_at DESC';

    const sessions = db.prepare(query).all(...params) as any[];

    const formatted = sessions.map(s => {
      let messages = [];
      try {
        messages = JSON.parse(s.messages);
      } catch {
        messages = [];
      }
      return {
        sessionId: s.session_id,
        visitorName: s.visitor_name || 'Anonymous',
        visitorPhone: s.visitor_phone || 'N/A',
        testOrCourse: s.test_or_course || 'Not specified',
        preferredTiming: s.preferred_timing || 'Not specified',
        step: s.step,
        isCompleted: Boolean(s.is_completed),
        messages,
        messageCount: messages.length,
        label: s.label || 'Cold',
        leadStatus: s.lead_status || 'Unlinked',
        followUpMessage: s.follow_up_message,
        createdAt: s.created_at,
        updatedAt: s.updated_at
      };
    });

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Lab Configuration Settings
app.put('/api/admin/config', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    db.prepare(`
      INSERT INTO lab_config (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
    `).run(key, String(value));

    res.json({ success: true, key, value });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// VITE DEV SERVER OR STATIC PRODUCTION BUILD
// ====================================================================
async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JeevanChat Server] running at http://0.0.0.0:${PORT}`);
    console.log(`[JeevanChat Server] Admin: yogeshlonare186@gmail.com`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
