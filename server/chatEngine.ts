import { db } from './db.js';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export interface ChatSessionState {
  sessionId: string;
  name: string;
  phone: string;
  testOrCourse: string;
  preferredTiming: string;
  step: 'greeting' | 'collect_name' | 'collect_phone' | 'collect_test' | 'collect_timing' | 'completed';
  messages: ChatMessage[];
  isCompleted: boolean;
}

// Exact compliance requirements
export const EXACT_FEE_RESPONSE = "The fees are Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course.";
export const EXACT_OUTSIDE_RESPONSE = "The Pathology team will call you back.";

// Helper to clean phone numbers
export function extractPhone(text: string): string | null {
  // Matches 10-digit Indian numbers, optional +91 or 0 prefix
  const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/;
  const match = text.match(phoneRegex);
  if (match) {
    return match[0].replace(/\s+/g, '');
  }
  // Also check general 10 consecutive digits
  const digitMatch = text.replace(/[^0-9]/g, '');
  if (digitMatch.length === 10 && /^[6-9]/.test(digitMatch)) {
    return digitMatch;
  }
  return null;
}

// Detect if query is asking about fees / cost
export function isFeeQuestion(text: string): boolean {
  const lower = text.toLowerCase();
  const feeKeywords = ['fee', 'fees', 'cost', 'costs', 'price', 'pricing', 'charge', 'charges', 'rate', 'rates', 'how much'];
  return feeKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lower);
  });
}

// Detect goodbye or intent to wrap up
export function isGoodbye(text: string): boolean {
  const lower = text.toLowerCase().trim();
  const goodbyeWords = ['bye', 'goodbye', 'bye bye', 'cya', 'exit', 'quit', 'done', 'thank you bye', 'thanks bye'];
  return goodbyeWords.some(w => lower === w || lower.startsWith(w + ' ') || lower.endsWith(' ' + w));
}

// Detect if message asks about outside matters (reports, doctors, home collection, other lab details)
export function isOutsideQuestion(text: string): boolean {
  const lower = text.toLowerCase();
  const outsideKeywords = [
    'doctor', 'dr.', 'dr ', 'pathologist', 'who is', 'qualification',
    'home collection', 'home sample', 'home visit', 'pickup', 'pick up', 'visit home',
    'report time', 'when will i get report', 'online report', 'download report', 'fasting',
    'discount', 'offer', 'package', 'x-ray machine', 'accreditation', 'nabl',
    'address', 'location', 'where are you', 'timing', 'opening time', 'open today', 'sunday'
  ];

  // If it's a direct fee question, that has higher precedence
  if (isFeeQuestion(text)) return false;

  return outsideKeywords.some(kw => lower.includes(kw));
}

// Assess lead urgency & completeness
export function classifyLead(name: string, phone: string, test: string, timing: string): 'Hot' | 'Warm' | 'Cold' {
  const hasName = Boolean(name && name.trim().length > 1);
  const hasPhone = Boolean(phone && extractPhone(phone));
  const hasTest = Boolean(test && test.trim().length > 2);
  const hasTiming = Boolean(timing && timing.trim().length > 1);

  if (!hasPhone && !hasName) {
    return 'Cold';
  }

  const timingLower = (timing || '').toLowerCase();
  const nearTermIndicators = ['today', 'tomorrow', 'morning', 'evening', 'now', 'asap', 'urgent', 'immediately', '8am', '9am', '10am', '5pm', '6pm'];
  const isNearTerm = nearTermIndicators.some(indicator => timingLower.includes(indicator));

  // Hot means they gave all details and a near-term timing
  if (hasName && hasPhone && hasTest && hasTiming && isNearTerm) {
    return 'Hot';
  }

  // If they gave all details but timing is next week / general, or gave phone + test
  if (hasPhone && (hasTest || hasName)) {
    return 'Warm';
  }

  // Little engagement or missing phone
  return 'Cold';
}

// Generate concise 2-3 line summary
export function generateSummary(name: string, phone: string, test: string, timing: string, messagesCount: number): string {
  const safeName = name || 'Anonymous visitor';
  const safePhone = phone || 'No phone provided';
  const safeTest = test || 'General inquiry / unconfirmed test';
  const safeTiming = timing || 'Preferred timing not specified';

  return `Lead for ${safeName} (${safePhone}) inquiring about "${safeTest}". Preferred appointment or callback window: ${safeTiming}. Captured via Jeevan assistant after ${messagesCount} conversational exchanges.`;
}

// Generate ready-to-copy WhatsApp/SMS message for lab team
export function generateFollowUpMessage(name: string, phone: string, test: string, timing: string): string {
  const safeName = name ? `${name} ji` : 'Sir/Madam';
  const safeTest = test || 'your requested diagnostic test';
  const safeTiming = timing ? `for ${timing}` : 'at your earliest convenience';

  return `Namaste ${safeName}, thank you for contacting Jeevan Pathology Lab, Pune. We received your request regarding ${safeTest} (${safeTiming}). Our team has reserved your priority slot at our FC Road, Shivaji Nagar centre. Please reply to this message or call us at +91 98220 12345 to confirm.`;
}

// Retrieve or create chat session
export function getOrCreateSession(sessionId: string): ChatSessionState {
  const row = db.prepare('SELECT * FROM chat_sessions WHERE session_id = ?').get(sessionId) as any;

  if (row) {
    let parsedMessages: ChatMessage[] = [];
    try {
      parsedMessages = JSON.parse(row.messages || '[]');
    } catch {
      parsedMessages = [];
    }

    return {
      sessionId: row.session_id,
      name: row.visitor_name || '',
      phone: row.visitor_phone || '',
      testOrCourse: row.test_or_course || '',
      preferredTiming: row.preferred_timing || '',
      step: row.step || 'greeting',
      messages: parsedMessages,
      isCompleted: Boolean(row.is_completed)
    };
  }

  // New session
  const initialGreeting: ChatMessage = {
    id: 'msg-init',
    role: 'assistant',
    text: 'Namaste! Welcome to Jeevan Pathology Lab, Pune. I am Jeevan, your digital lab assistant. May I please know your full name?',
    timestamp: new Date().toISOString()
  };

  const newState: ChatSessionState = {
    sessionId,
    name: '',
    phone: '',
    testOrCourse: '',
    preferredTiming: '',
    step: 'collect_name',
    messages: [initialGreeting],
    isCompleted: false
  };

  db.prepare(`
    INSERT INTO chat_sessions (session_id, visitor_name, visitor_phone, test_or_course, preferred_timing, step, messages, is_completed, created_at, updated_at)
    VALUES (?, '', '', '', '', 'collect_name', ?, 0, datetime('now'), datetime('now'))
  `).run(sessionId, JSON.stringify([initialGreeting]));

  return newState;
}

// Process user message through Jeevan assistant
export function processUserMessage(session: ChatSessionState, userText: string): { reply: string; session: ChatSessionState; leadSaved: boolean } {
  const cleanInput = userText.trim();
  const timestamp = new Date().toISOString();

  // Add user message to history
  session.messages.push({
    id: `msg-${Date.now()}-u`,
    role: 'user',
    text: cleanInput,
    timestamp
  });

  let assistantReply = '';
  let shouldFinalizeLead = false;

  // 1. Check for Goodbye / Exit
  if (isGoodbye(cleanInput)) {
    assistantReply = 'Thank you for reaching out to Jeevan Pathology Lab, Pune. Our team has your details and will assist you shortly. Have a healthy day ahead!';
    session.isCompleted = true;
    shouldFinalizeLead = true;
  }
  // 2. Check for Fee inquiries (STRICT RULE: "Answer fee questions using only these fees: Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course. Do not invent any other fees, discounts, or offers.")
  else if (isFeeQuestion(cleanInput)) {
    // If asking about fees, answer strictly with exact fees and gently guide to next required step
    const nextPrompt = getNextStepPrompt(session);
    assistantReply = `${EXACT_FEE_RESPONSE} ${nextPrompt}`.trim();
  }
  // 3. Check for Out-of-Scope inquiries (STRICT RULE: "For any question outside the information provided (other fees, reports, doctor details, home collection, anything else), reply exactly: 'The Pathology team will call you back.' Do not guess.")
  else if (isOutsideQuestion(cleanInput)) {
    const nextPrompt = getNextStepPrompt(session);
    // Reply strictly with exact message plus prompt for next missing lead field
    assistantReply = `${EXACT_OUTSIDE_RESPONSE} ${nextPrompt}`.trim();
  }
  // 4. Natural Conversational Order: Name -> Phone -> Test/Course -> Timing
  else {
    // If name is not yet recorded
    if (!session.name) {
      // Clean name extraction
      const extractedName = cleanInput
        .replace(/^(my name is|i am|this is|myself|call me)\s+/i, '')
        .trim();
      
      session.name = extractedName || cleanInput;
      session.step = 'collect_phone';
      assistantReply = `Thank you, ${session.name}! Could you please share your 10-digit mobile number so our pathology team in Pune can reach you?`;
    }
    // If phone is not yet recorded
    else if (!session.phone) {
      const extracted = extractPhone(cleanInput);
      if (extracted) {
        session.phone = extracted;
        session.step = 'collect_test';
        assistantReply = `Thank you for sharing your contact number. Which lab test (e.g., Blood test, CBC, Urine analysis, X-Ray) or training course are you interested in?`;
      } else {
        // If not a clear phone, re-prompt or accept what they provided
        session.phone = cleanInput;
        session.step = 'collect_test';
        assistantReply = `Got it. Which lab test (e.g. Blood test, CBC, Urine test, X-Ray) or technician course would you like to inquire about?`;
      }
    }
    // If test is not yet recorded
    else if (!session.testOrCourse) {
      session.testOrCourse = cleanInput;
      session.step = 'collect_timing';
      assistantReply = `Understood: ${cleanInput}. What is your preferred date or timing for your visit to our lab, or for a callback from our team?`;
    }
    // If timing is not yet recorded
    else if (!session.preferredTiming) {
      session.preferredTiming = cleanInput;
      session.step = 'completed';
      session.isCompleted = true;
      shouldFinalizeLead = true;
      assistantReply = `Thank you so much, ${session.name}! We have recorded your interest in ${session.testOrCourse} with preferred timing "${session.preferredTiming}". Our Pune pathology team will connect with you on ${session.phone}. Have a wonderful day!`;
    }
    // If all details already collected, acknowledge and confirm
    else {
      assistantReply = `Thank you! Your information is already confirmed. Our Pune pathology desk at +91 98220 12345 will be in touch with you shortly.`;
    }
  }

  // Add assistant reply to message history
  session.messages.push({
    id: `msg-${Date.now()}-a`,
    role: 'assistant',
    text: assistantReply,
    timestamp: new Date().toISOString()
  });

  // Save session state to database
  saveSessionToDb(session);

  // If lead is ready or conversation ended, persist to leads table
  let leadSaved = false;
  if (shouldFinalizeLead || session.name || session.phone) {
    leadSaved = syncLeadRecord(session);
  }

  return {
    reply: assistantReply,
    session,
    leadSaved
  };
}

// Return prompt for whatever is missing next
function getNextStepPrompt(session: ChatSessionState): string {
  if (!session.name) {
    return 'May I please know your name?';
  }
  if (!session.phone) {
    return `Could you please share your mobile number so we can help you with this?`;
  }
  if (!session.testOrCourse) {
    return `Which test or course are you planning for?`;
  }
  if (!session.preferredTiming) {
    return `What would be your preferred timing for a visit or callback?`;
  }
  return '';
}

// Persist session to chat_sessions table
export function saveSessionToDb(session: ChatSessionState) {
  db.prepare(`
    INSERT INTO chat_sessions (
      session_id, visitor_name, visitor_phone, test_or_course, preferred_timing, step, messages, is_completed, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(session_id) DO UPDATE SET
      visitor_name = excluded.visitor_name,
      visitor_phone = excluded.visitor_phone,
      test_or_course = excluded.test_or_course,
      preferred_timing = excluded.preferred_timing,
      step = excluded.step,
      messages = excluded.messages,
      is_completed = excluded.is_completed,
      updated_at = datetime('now')
  `).run(
    session.sessionId,
    session.name,
    session.phone,
    session.testOrCourse,
    session.preferredTiming,
    session.step,
    JSON.stringify(session.messages),
    session.isCompleted ? 1 : 0
  );
}

// Sync or create lead record in leads table
export function syncLeadRecord(session: ChatSessionState): boolean {
  if (!session.name && !session.phone && !session.testOrCourse) {
    return false;
  }

  const label = classifyLead(session.name, session.phone, session.testOrCourse, session.preferredTiming);
  const summary = generateSummary(session.name, session.phone, session.testOrCourse, session.preferredTiming, session.messages.length);
  const followUpMessage = generateFollowUpMessage(session.name, session.phone, session.testOrCourse, session.preferredTiming);
  const transcriptJson = JSON.stringify(session.messages);

  const existing = db.prepare('SELECT id FROM leads WHERE session_id = ?').get(session.sessionId) as { id: number } | undefined;

  if (existing) {
    db.prepare(`
      UPDATE leads SET
        name = ?,
        phone = ?,
        test_or_course = ?,
        preferred_timing = ?,
        label = ?,
        summary = ?,
        chat_transcript = ?,
        follow_up_message = ?,
        updated_at = datetime('now')
      WHERE session_id = ?
    `).run(
      session.name || 'Anonymous',
      session.phone || 'Pending',
      session.testOrCourse || 'General Inquiry',
      session.preferredTiming || 'Pending',
      label,
      summary,
      transcriptJson,
      followUpMessage,
      session.sessionId
    );

    // Link lead_id to chat session
    db.prepare('UPDATE chat_sessions SET lead_id = ? WHERE session_id = ?').run(existing.id, session.sessionId);
    return true;
  } else {
    const result = db.prepare(`
      INSERT INTO leads (
        session_id, name, phone, test_or_course, preferred_timing, label, summary, chat_transcript, follow_up_message, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', datetime('now'), datetime('now'))
    `).run(
      session.sessionId,
      session.name || 'Anonymous',
      session.phone || 'Pending',
      session.testOrCourse || 'General Inquiry',
      session.preferredTiming || 'Pending',
      label,
      summary,
      transcriptJson,
      followUpMessage
    );

    const newLeadId = result.lastInsertRowid;
    db.prepare('UPDATE chat_sessions SET lead_id = ? WHERE session_id = ?').run(newLeadId, session.sessionId);
    return true;
  }
}
