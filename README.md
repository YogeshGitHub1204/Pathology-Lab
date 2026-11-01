# JeevanChat — Lead Capture Application for Jeevan Pathology Lab, Pune

**JeevanChat** is a production-ready, full-stack lead-capture web application designed specifically for **Jeevan Pathology Lab**, an accredited diagnostic laboratory in Pune, Maharashtra, India. It features a public-facing medical landing page with an embedded conversational assistant named **Jeevan**, and a login-protected **Admin Dashboard** for managing patient inquiries, Hot/Warm/Cold leads, WhatsApp follow-ups, and customer chat histories.

---

## 1. Project Folder Structure

```text
├── index.html                       # HTML5 entry with Plus Jakarta Sans & SEO meta tags
├── metadata.json                    # Application metadata and capabilities
├── package.json                     # Node.js dependencies and run scripts
├── tsconfig.json                    # Strict TypeScript configuration
├── vite.config.ts                   # Vite bundler configuration with Tailwind CSS v4
├── schema.sql                       # Complete SQLite relational database schema
├── server.ts                        # Full-Stack Express server with Vite middleware integration
├── jeevan.db                        # SQLite database file (created automatically with WAL mode)
├── server/
│   ├── db.ts                        # SQLite database initialization, scrypt password hashing & seeds
│   └── chatEngine.ts                # Conversational state-machine and strict response handler for "Jeevan"
├── src/
│   ├── main.tsx                     # React 19 application root bootstrap
│   ├── App.tsx                      # Top-level view routing (Landing, Admin Login, Dashboard, Customer Chats)
│   ├── index.css                    # Global Tailwind CSS v4 styling
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces for leads, sessions, tests, and lab config
│   ├── data/
│   │   └── labTests.ts              # Diagnostic catalog (Blood tests, Urine tests, X-Rays, Courses)
│   ├── assets/
│   │   └── images/                  # High-fidelity pathology laboratory visual assets
│   │       ├── lab_interior_...jpg        # Clinical diagnostic analyzers floor
│   │       ├── sample_collection_...jpg   # Phlebotomy & accession station
│   │       └── pathologist_at_work_...jpg # Microscopic slide examination
│   └── components/
│       ├── Navbar.tsx               # 3-Zone top navigation bar adhering to design constitution
│       ├── Hero.tsx                 # Pune value proposition with marquee lab interior photography
│       ├── LabTestsSection.tsx      # Diagnostic test menu with category tabs & 1-click chatbot inquiry
│       ├── LabInfoSection.tsx       # Pune address, operational hours, clickable phone & photo slots
│       ├── FeeNoticeSection.tsx     # Transparent course fees (Rs 1,500, Rs 2,500, Rs 3,000 / month)
│       ├── Footer.tsx               # Quiet footer with Pune details and staff login link
│       ├── ChatWidget.tsx           # Floating conversational assistant "Jeevan" with lead capture
│       └── admin/
│           ├── AdminLogin.tsx           # Secure admin authentication
│           ├── AdminDashboard.tsx       # Lead table, Hot/Warm/Cold filters, WhatsApp messaging & drawer
│           ├── CustomerChatsPage.tsx    # Dedicated customer chat history and search browser
│           └── AdminSettingsModal.tsx   # Password change and lab contact configuration
└── README.md                        # Complete documentation & local execution instructions
```

---

## 2. Installation & Run Commands

### Prerequisites
- Node.js (version 18, 20, or 22 recommended)
- npm or pnpm

### Quick Start
```bash
# 1. Install all dependencies
npm install

# 2. Run the application locally (Express server on port 3000 with Vite middleware)
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

### Production Build
```bash
# Build the frontend assets
npm run build

# Start the production server
npm start
```

---

## 3. Configured Admin Credentials

The admin portal is pre-configured with secure credentials:

- **Admin Email:** `yogeshlonare186@gmail.com`
- **Default Password:** `JeevanAdmin@2026`

Passwords are encrypted using Node.js's cryptographic `scrypt` hashing algorithm paired with a unique 16-byte cryptographically secure salt.

---

## 4. How to Change Configuration, Fees & Admin Password

### A. In-App Settings (Easiest)
1. Log in to the Admin Portal at `http://localhost:3000` using the **Admin** button in the top navigation or footer.
2. In the Admin Dashboard header, click the **Settings** button.
3. **Change Password Tab:**
   - Enter your current password (`JeevanAdmin@2026`).
   - Enter your desired new password (minimum 6 characters).
   - Click **Save New Password**.
4. **Lab Details & Fees Tab:**
   - Modify the Pune Lab phone number, full address, operational hours, or fee notice.
   - Click **Save Lab Details**. Changes reflect immediately across the public website!

### B. In Code or SQLite Database
- **Admin Password:** You can update the password hash directly using the `hashPassword()` helper in `server/db.ts` or run:
  ```bash
  # SQL query to inspect users
  sqlite3 jeevan.db "SELECT id, email, created_at FROM admin_users;"
  ```
- **Laboratory Details & Timings:** Stored in the `lab_config` table in `jeevan.db`. You can modify default values in `server/db.ts` in the `configs` array.
- **Fees:** Handled by `server/chatEngine.ts` via the `EXACT_FEE_RESPONSE` constant:
  ```typescript
  export const EXACT_FEE_RESPONSE = "The fees are Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course.";
  ```

---

## 5. Assistant "Jeevan" Behavior & Lead Classification

1. **Conversational Flow:**
   Gathers in natural conversational sequence:
   - Visitor Name
   - 10-digit Mobile Number
   - Test or Course of interest
   - Preferred Timing for a visit or callback
2. **Strict Fee Policy:**
   Answers fee questions using *strictly* the approved tiers:
   `Rs 1,500, Rs 2,500, and Rs 3,000 per month, depending on the course`. No other fees, discounts, or offers are invented.
3. **Strict Fallback Policy:**
   For questions outside the provided knowledge (other fees, specific doctor qualifications, home collection availability, etc.), replies exactly:
   `"The Pathology team will call you back."`
4. **Lead Classification (Hot / Warm / Cold):**
   - **Hot (Red Badge):** All 4 details provided (Name + Phone + Test + near-term timing like today, tomorrow, morning).
   - **Warm (Orange Badge):** Partial details or later timing (e.g. next week, unspecified timing).
   - **Cold (Blue Badge):** Little engagement or visitor dropped off without contact details.

---

## 6. Ready-to-Copy WhatsApp / SMS Follow-Up

> *"Namaste [Patient Name] ji, thank you for reaching out to Jeevan Pathology Lab, Pune. We received your request regarding [Test/Course] for [Preferred Timing]. Our team has reserved your priority slot at our FC Road, Shivaji Nagar centre. Please reply to this message or call us at +91 98220 12345 to confirm."*

---

## 7. Model Context Protocol (MCP) Server

The application exposes an unauthenticated, streamable HTTP MCP server at `/mcp` with full CORS support (including `OPTIONS` preflight). AI assistants and MCP clients can interact with it using JSON-RPC 2.0 requests via `POST /mcp`.

### Supported JSON-RPC Methods
1. `initialize`: Returns protocolVersion `"2025-06-18"` and server capabilities.
2. `tools/list`: Returns definitions for all three exposed tools.
3. `tools/call`: Dispatches to and executes the requested tool.

### Exposed Tools
1. **`list_hot_leads`**  
   *Description:* `"List leads labelled Hot, newest first, with name, course and phone."`  
   *Output:* JSON array of leads labelled Hot, newest first, containing name, course, and phone.

2. **`get_lead_summary`**  
   *Description:* `"Given a lead's name, return the saved summary and quality label."`  
   *Arguments:* `{ "name": "Lead Name" }`  
   *Output:* Stored summary and quality label for the lead, or a structured error if not found.

3. **`draft_followup`**  
   *Description:* `"Given a lead's name, return the saved WhatsApp follow-up message."`  
   *Arguments:* `{ "name": "Lead Name" }`  
   *Output:* Stored WhatsApp follow-up text for the lead, or a structured error if not found.

### Interactive MCP Test Page
Visit **`/mcp-test`** in your browser to test all three tools with live JSON response inspectors and custom lead name inputs.

