-- ====================================================================
-- JeevanChat Database Schema for SQLite
-- Jeevan Pathology Lab, Pune, Maharashtra
-- ====================================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sessions Table for Admin Authentication
CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- 3. Leads Table
-- Stores visitor leads with contact info, requested test/course,
-- label (Hot / Warm / Cold), 2-3 line summary, and transcript
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  test_or_course TEXT NOT NULL,
  preferred_timing TEXT NOT NULL,
  label TEXT NOT NULL CHECK(label IN ('Hot', 'Warm', 'Cold')),
  summary TEXT NOT NULL,
  chat_transcript TEXT NOT NULL, -- JSON array of messages
  follow_up_message TEXT NOT NULL, -- WhatsApp/SMS ready message
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Scheduled', 'Completed', 'Archived'
  notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_label ON leads(label);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- 4. Chat Sessions & Transcripts Table
-- Records ongoing and historical customer chat conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  session_id TEXT PRIMARY KEY,
  visitor_name TEXT DEFAULT '',
  visitor_phone TEXT DEFAULT '',
  test_or_course TEXT DEFAULT '',
  preferred_timing TEXT DEFAULT '',
  step TEXT DEFAULT 'greeting',
  messages TEXT NOT NULL, -- JSON array of chat messages
  is_completed INTEGER DEFAULT 0,
  lead_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON chat_sessions(created_at);

-- 5. Lab Configuration Table
-- Key-value store for lab timings, address, contact, fees notice
CREATE TABLE IF NOT EXISTS lab_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
