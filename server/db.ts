import Database from 'better-sqlite3';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Database file stored locally in project root
const DB_PATH = path.resolve(process.cwd(), 'jeevan.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Password Hashing with scrypt and random salt
export function hashPassword(password: string, existingSalt?: string) {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
}

// Initialize tables and seed default admin user
export function initializeDatabase() {
  const schemaPath = path.resolve(process.cwd(), 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  // Check or seed admin user: yogeshlonare186@gmail.com
  const adminEmail = 'yogeshlonare186@gmail.com';
  const defaultAdminPass = 'JeevanAdmin@2026';
  
  const existingAdmin = db.prepare('SELECT id, email FROM admin_users WHERE email = ?').get(adminEmail) as { id: number; email: string } | undefined;
  
  if (!existingAdmin) {
    const { hash, salt } = hashPassword(defaultAdminPass);
    db.prepare(`
      INSERT INTO admin_users (email, password_hash, salt, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(adminEmail, hash, salt, 'Jeevan Lab Admin');
    console.log(`[Database] Seeded admin user: ${adminEmail} (password: ${defaultAdminPass})`);
  }

  // Seed default lab configurations
  const configs = [
    { key: 'lab_name', value: 'Jeevan Pathology Lab' },
    { key: 'lab_city', value: 'Pune' },
    { key: 'lab_address', value: 'Shop 12-14, Ground Floor, Fortune Business Centre, Near Goodluck Chowk, FC Road, Shivaji Nagar, Pune, Maharashtra 411005' },
    { key: 'lab_phone', value: '+91 98220 12345' },
    { key: 'lab_phone_raw', value: '+919822012345' },
    { key: 'lab_whatsapp', value: '+919822012345' },
    { key: 'lab_email', value: 'contact@jeevanpathologylab.com' },
    { key: 'lab_timings', value: 'Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM' },
    { key: 'lab_sample_collection_timings', value: 'Mon - Sat: 7:00 AM – 8:30 PM | Sun: 7:00 AM – 1:30 PM' },
    { key: 'lab_report_dispatch', value: 'Same Day by 7:00 PM (WhatsApp & Printed)' },
    { key: 'fee_notice', value: 'Pathology Technician & Phlebotomy Certification courses: Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course.' }
  ];

  const insertConfig = db.prepare(`
    INSERT OR IGNORE INTO lab_config (key, value, updated_at)
    VALUES (?, ?, datetime('now'))
  `);

  for (const item of configs) {
    insertConfig.run(item.key, item.value);
  }

  // Seed initial sample leads if table is empty
  const count = db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number };
  if (count.count === 0) {
    seedSampleLeads();
  }
}

function seedSampleLeads() {
  const sampleLeads = [
    {
      session_id: 'seed-sess-001',
      name: 'Rahul Deshmukh',
      phone: '+91 98221 54321',
      test_or_course: 'Complete Blood Count (CBC) & Fasting Blood Sugar',
      preferred_timing: 'Tomorrow morning at 8:30 AM',
      label: 'Hot',
      summary: 'Patient Rahul requested urgent morning fasting blood sugar and CBC checkup for tomorrow. Complete phone number and convenient morning slot provided.',
      chat_transcript: JSON.stringify([
        { id: '1', role: 'assistant', text: 'Namaste! Welcome to Jeevan Pathology Lab, Pune. I am Jeevan, your lab assistant. May I know your name please?', timestamp: '2026-11-01T08:00:00Z' },
        { id: '2', role: 'user', text: 'Hi, I am Rahul Deshmukh', timestamp: '2026-11-01T08:00:25Z' },
        { id: '3', role: 'assistant', text: 'Nice to meet you, Rahul! Could you please share your 10-digit mobile number so our team can coordinate with you?', timestamp: '2026-11-01T08:00:27Z' },
        { id: '4', role: 'user', text: '9822154321', timestamp: '2026-11-01T08:00:45Z' },
        { id: '5', role: 'assistant', text: 'Thank you, Rahul. Which pathology test or diploma course are you interested in?', timestamp: '2026-11-01T08:00:47Z' },
        { id: '6', role: 'user', text: 'I need CBC and Fasting Blood Sugar tests', timestamp: '2026-11-01T08:01:10Z' },
        { id: '7', role: 'assistant', text: 'Got it. What is your preferred date or timing for your lab visit or call?', timestamp: '2026-11-01T08:01:12Z' },
        { id: '8', role: 'user', text: 'Tomorrow morning at 8:30 AM', timestamp: '2026-11-01T08:01:30Z' },
        { id: '9', role: 'assistant', text: 'Thank you Rahul! Your details have been recorded. Our Pune pathology team will confirm your slot at 8:30 AM tomorrow. For fasting sugar, please maintain 8-10 hours fasting.', timestamp: '2026-11-01T08:01:32Z' }
      ]),
      follow_up_message: 'Hello Rahul Deshmukh ji, thank you for reaching out to Jeevan Pathology Lab, Pune. We have your request for Complete Blood Count (CBC) & Fasting Blood Sugar for tomorrow morning at 8:30 AM. Please maintain 8-10 hours overnight fasting. We are ready at FC Road branch. Contact: +91 98220 12345.',
      status: 'New',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      session_id: 'seed-sess-002',
      name: 'Pooja Kulkarni',
      phone: '+91 97654 11223',
      test_or_course: 'Digital Chest X-Ray PA View',
      preferred_timing: 'Today evening 5:30 PM',
      label: 'Hot',
      summary: 'Urgent chest X-ray needed today evening by 5:30 PM following physician recommendation. Contact verified and immediate booking slot required.',
      chat_transcript: JSON.stringify([
        { id: '1', role: 'assistant', text: 'Namaste! Welcome to Jeevan Pathology Lab, Pune. I am Jeevan. May I know your name please?', timestamp: '2026-11-01T09:15:00Z' },
        { id: '2', role: 'user', text: 'Pooja Kulkarni', timestamp: '2026-11-01T09:15:20Z' },
        { id: '3', role: 'assistant', text: 'Hello Pooja ji. Could you provide your mobile number for booking confirmation?', timestamp: '2026-11-01T09:15:22Z' },
        { id: '4', role: 'user', text: '9765411223', timestamp: '2026-11-01T09:15:40Z' },
        { id: '5', role: 'assistant', text: 'Thank you Pooja ji. Which test or course do you need?', timestamp: '2026-11-01T09:15:42Z' },
        { id: '6', role: 'user', text: 'Chest X-Ray PA View as advised by my doctor', timestamp: '2026-11-01T09:16:02Z' },
        { id: '7', role: 'assistant', text: 'Understood. When would you prefer to visit our Shivaji Nagar clinic today?', timestamp: '2026-11-01T09:16:05Z' },
        { id: '8', role: 'user', text: 'Today evening 5:30 PM', timestamp: '2026-11-01T09:16:20Z' },
        { id: '9', role: 'assistant', text: 'Perfect! Your visit for Digital Chest X-Ray is confirmed for 5:30 PM today at our FC Road center. Reports will be provided within 45 minutes.', timestamp: '2026-11-01T09:16:22Z' }
      ]),
      follow_up_message: 'Namaste Pooja ji, this is Jeevan Pathology Lab, Pune. Your slot for Digital Chest X-Ray PA View is reserved for today 5:30 PM at Fortune Business Centre, FC Road. Pathologist is available. Hotline: +91 98220 12345.',
      status: 'Contacted',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      session_id: 'seed-sess-003',
      name: 'Amit Joshi',
      phone: '+91 94220 88990',
      test_or_course: 'Medical Lab Technician Certification Course',
      preferred_timing: 'Next Monday around 11:00 AM',
      label: 'Warm',
      summary: 'Inquired about the pathology technician course curriculum and fees. Assistant clarified course fees (Rs 1,500, Rs 2,500, and Rs 3,000 per month). Amit requested a counseling call next Monday.',
      chat_transcript: JSON.stringify([
        { id: '1', role: 'assistant', text: 'Namaste! Welcome to Jeevan Pathology Lab, Pune. I am Jeevan. May I know your name?', timestamp: '2026-10-31T14:10:00Z' },
        { id: '2', role: 'user', text: 'Amit Joshi', timestamp: '2026-10-31T14:10:15Z' },
        { id: '3', role: 'assistant', text: 'Hello Amit! May I have your phone number to assist you further?', timestamp: '2026-10-31T14:10:17Z' },
        { id: '4', role: 'user', text: '9422088990', timestamp: '2026-10-31T14:10:35Z' },
        { id: '5', role: 'assistant', text: 'Thanks Amit. Which test or lab course are you interested in?', timestamp: '2026-10-31T14:10:37Z' },
        { id: '6', role: 'user', text: 'What are the fees for lab technician training course?', timestamp: '2026-10-31T14:11:00Z' },
        { id: '7', role: 'assistant', text: 'The fees are Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course.', timestamp: '2026-10-31T14:11:02Z' },
        { id: '8', role: 'user', text: 'Okay, I am interested in enrolling. Can someone call me next Monday 11:00 AM?', timestamp: '2026-10-31T14:11:30Z' },
        { id: '9', role: 'assistant', text: 'Thank you Amit. We have noted your interest in the course and your preferred time: Next Monday at 11:00 AM. Our academic coordinator will call you then.', timestamp: '2026-10-31T14:11:32Z' }
      ]),
      follow_up_message: 'Hello Amit Joshi, greetings from Jeevan Pathology Lab Academy, Pune. Regarding your inquiry on the Technician Training Course (Rs 1,500 / Rs 2,500 / Rs 3,000 monthly tracks), we have scheduled your briefing call for Monday 11:00 AM. Lab coordinator: +91 98220 12345.',
      status: 'New',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      session_id: 'seed-sess-004',
      name: 'Sneha Patil',
      phone: '+91 98901 33445',
      test_or_course: 'Lipid Profile & Liver Function Test (LFT)',
      preferred_timing: 'Coming weekend (Saturday morning)',
      label: 'Warm',
      summary: 'Routine health checkup inquiry for lipid and liver panels. Patient asked about home collection; assistant correctly answered with lab callback policy. Saturday morning appointment requested.',
      chat_transcript: JSON.stringify([
        { id: '1', role: 'assistant', text: 'Namaste! Welcome to Jeevan Pathology Lab, Pune. I am Jeevan. May I know your name?', timestamp: '2026-10-30T11:00:00Z' },
        { id: '2', role: 'user', text: 'Sneha Patil', timestamp: '2026-10-30T11:00:18Z' },
        { id: '3', role: 'assistant', text: 'Pleasure to connect, Sneha! Could you share your mobile number?', timestamp: '2026-10-30T11:00:20Z' },
        { id: '4', role: 'user', text: '9890133445', timestamp: '2026-10-30T11:00:35Z' },
        { id: '5', role: 'assistant', text: 'Thank you. Which test or course would you like information on?', timestamp: '2026-10-30T11:00:37Z' },
        { id: '6', role: 'user', text: 'Lipid Profile and LFT. Do you offer home sample pickup in Kothrud?', timestamp: '2026-10-30T11:00:55Z' },
        { id: '7', role: 'assistant', text: 'The Pathology team will call you back.', timestamp: '2026-10-30T11:00:57Z' },
        { id: '8', role: 'user', text: 'Alright, Saturday morning works for me.', timestamp: '2026-10-30T11:01:20Z' },
        { id: '9', role: 'assistant', text: 'Thank you Sneha. We have recorded your interest in Lipid Profile & LFT for Saturday morning. The team will call you back to confirm details.', timestamp: '2026-10-30T11:01:22Z' }
      ]),
      follow_up_message: 'Hello Sneha ji, thank you for contacting Jeevan Pathology Lab, Pune. Regarding your Lipid Profile & LFT inquiry for Saturday morning, our team is calling you to coordinate sample collection and prep guidelines. Pune Helpdesk: +91 98220 12345.',
      status: 'Scheduled',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
      session_id: 'seed-sess-005',
      name: 'Visitor from Kothrud',
      phone: 'Not provided',
      test_or_course: 'Urine Routine Examination',
      preferred_timing: 'Unspecified',
      label: 'Cold',
      summary: 'Visitor asked briefly about urine culture preparation and test cost, but did not leave a mobile number or confirmed appointment timing.',
      chat_transcript: JSON.stringify([
        { id: '1', role: 'assistant', text: 'Namaste! Welcome to Jeevan Pathology Lab, Pune. I am Jeevan. May I know your name?', timestamp: '2026-10-29T16:00:00Z' },
        { id: '2', role: 'user', text: 'Just checking urine test info', timestamp: '2026-10-29T16:00:20Z' },
        { id: '3', role: 'assistant', text: 'Hello! Could you share your name and mobile number so we can help you with the test details?', timestamp: '2026-10-29T16:00:22Z' },
        { id: '4', role: 'user', text: 'I will call back later bye', timestamp: '2026-10-29T16:00:45Z' },
        { id: '5', role: 'assistant', text: 'Thank you for visiting Jeevan Pathology Lab, Pune. Have a healthy day!', timestamp: '2026-10-29T16:00:47Z' }
      ]),
      follow_up_message: 'Hello from Jeevan Pathology Lab, Pune. We noticed your interest in urine diagnostic tests. For quick assistance and same-day reports, call our desk at +91 98220 12345.',
      status: 'New',
      created_at: new Date(Date.now() - 3600000 * 72).toISOString()
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO leads (session_id, name, phone, test_or_course, preferred_timing, label, summary, chat_transcript, follow_up_message, status, created_at, updated_at)
    VALUES (@session_id, @name, @phone, @test_or_course, @preferred_timing, @label, @summary, @chat_transcript, @follow_up_message, @status, @created_at, @created_at)
  `);

  const chatStmt = db.prepare(`
    INSERT OR REPLACE INTO chat_sessions (session_id, visitor_name, visitor_phone, test_or_course, preferred_timing, step, messages, is_completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'completed', ?, 1, ?, ?)
  `);

  for (const lead of sampleLeads) {
    stmt.run(lead);
    chatStmt.run(lead.session_id, lead.name, lead.phone, lead.test_or_course, lead.preferred_timing, lead.chat_transcript, lead.created_at, lead.created_at);
  }

  console.log(`[Database] Seeded ${sampleLeads.length} initial leads & chat histories.`);
}
