# 🚩 DECODE ARENA — Organizer Manual & Vulnerability Cheat Sheet
### ⚠️ STRICTLY FOR ORGANIZERS — DO NOT SHARE WITH PARTICIPANTS ⚠️

---

## 📖 How to Use & Conduct This Event

### 🎯 What is Decode Arena?
Decode Arena ("Hack The Code") is a beginner-friendly cybersecurity symposium event. 
Participants do two things:
1. **Evaluate Incident Scenarios**: Navigate 6 categories of operational cybersecurity scenarios ("In this scenario, what would you choose?") and make real-world defense decisions.
2. **Inspect The Website**: Use browser tools (`Ctrl+U` to View Source, `F12` for DevTools & Console) to discover hidden flags and vulnerabilities planted directly into this website!

---

### 💻 Step 1: How to Run the Website for Participants

Choose any of these 3 easy methods:

* **Method A: Direct File Open (Simplest)**
  - Put `index.html` on the lab computers.
  - Double-click `index.html` — it will open instantly in Chrome, Firefox, or Edge. No server or internet needed!

* **Method B: VS Code Live Server (Recommended)**
  - Open the folder in VS Code.
  - Right-click `index.html` and click **"Open with Live Server"**.
  - It opens at `http://localhost:5500`.

* **Method C: Single Host for Lab (Local Network)**
  - Run Live Server on the organizer's laptop.
  - Connect all lab PCs to the same Wi-Fi / LAN.
  - Share your laptop's IP address: `http://192.168.x.x:5500` with participants.

---

### 📝 Step 2: How Participants Submit Answers

Choose any of these collection methods:

1. **Direct Google Sheet Auto-Sync (Recommended & Built-in)**:
   - Participants solve the scenarios in `index.html`. When they finish and submit their scorecard, JavaScript automatically transmits their scores, session timings (`Start_Time`, `End_Time`, `Time_Taken`), and team details directly to your Google Sheet (`ROUND_DATA` tab) via Google Apps Script.
   - If the venue network is intermittent or offline, submissions are saved in the browser's `localStorage` queue and automatically flushed to the sheet upon reconnection.
2. **Google Form (Alternative)**:
   - Create a Google Form with fields (Participant Name, College, Category answers, Bonus flags) and share via projector/QR code.
3. **Pen & Paper / Printed Answer Sheet**:
   - Print a sheet with numbered blanks (1 to 30) for participants to write down flags.

---

### ⏱️ Step 3: Event Schedule & Flow (Example 2-Hour Plan)

| Time | What to Do |
|------|------------|
| **0:00 - 0:15** | **Briefing**: Welcome participants. Explain what a flag looks like (`DECODE{...}`). Tell them to read scenario clues and use `F12` to inspect the site. |
| **0:15 - 1:30** | **Challenge Time (75 mins)**: Participants explore categories, make scenario decisions, and search the site code for hidden flags. |
| **1:30 - 1:45** | **Submission Cutoff**: Everyone submits their scorecard via **Send to WhatsApp Coordinator**, live **Google Sheet Sync**, or downloads their **Official Score Sheet (PNG)**. |
| **1:45 - 2:00** | **Scoring & Winner Announcement**: Use the answer key below to grade and award top scorers! |

---

### 📜 Step 4: Digital Score Sheet & Sharing (Solo & Team Modes)

The website includes a built-in **Official Score Sheet** feature:
- **Solo Mode**: Enter Participant Name & College Name.
- **Team Mode**: Enter Team Name, College Name, and 3 Team Member Names (Lead + 2 members).
- **Features**:
  - 📥 **Download PNG**: Instant high-res certificate PNG export.
  - 📥 **Download JPG**: High-res certificate JPEG export.
  - 📋 **Copy Text Summary**: Formatted scorecard for Discord, Telegram, or submission forms.
  - 📲 **Send to WhatsApp Coordinator**: Automatically transmits the scorecard to the symposium coordinator's WhatsApp (`+91 8778313186` configured securely on `server.js`) in the background without opening WhatsApp or exposing the phone number to participants.
  - 📊 **Set Google Sheet URL**: Configure your deployed Google Apps Script Web App URL so submissions stream directly to your Google Sheet in real time.
  - 🚀 **Submit to Program Database**: Stores submission and full Base64 certificate image directly into project database files.
  - 📦 **Export Program DB (.json)**: Download the unencrypted program database dump anytime.

---

### 💾 Step 5: Project Database & Storage Files (Unencrypted CWE-312)

All participant and team submissions are stored directly in the project's dedicated database files:
- **`database/arena_database.json`**: Real unencrypted JSON file storing all submissions, scores, and Base64 certificate images on disk.
- **`database/schema.sql`**: SQL database schema with unencrypted INSERT records.
- **`server.js`**: Lightweight local Node.js database server (run `node server.js` on port 3000).
- **`view_database.js`**: Run in terminal (`node view_database.js`) to view all stored submissions and images.
- **Intentional Vulnerability**: Demonstrates **CWE-312** (Cleartext Storage of Sensitive Information). The admin record inside leaks the secret flag: `DECODE{plaintext_database_storage_is_vulnerable}`.

---

### 📊 Step 6: Google Sheets Live Score Synchronization & Offline Queue

The website includes an automated Google Sheets pipeline powered by Google Apps Script (`doPost(e)`):
- **Live Spreadsheet Sync**: Every submission appends a new row to the `ROUND_DATA` sheet tab with 16 comprehensive data columns:
  `Timestamp`, `Team_ID`, `Team_Name`, `College`, `Members`, `Mode`, `Round`, `Score`, `Total`, `Correct`, `Wrong`, `Security_Tier`, `Start_Time`, `End_Time`, `Time_Taken`, and `Action`.
- **Duration & Timing Tracking**: Accurately tracks when the participant began (`Start_Time`), when they submitted (`End_Time`), and the elapsed duration (`Time_Taken`, e.g., `14m 32s`).
- **Resilient Offline Queue**: If the venue Wi-Fi drops or a machine is offline, submissions are never lost. `saveOffline(data)` stores the payload in browser `localStorage`. A navbar indicator (`📡 N Pending Sync`) alerts the user, and `window.addEventListener('online', syncQueue)` automatically flushes all pending submissions to Google Sheets when connection is restored.
- **Detailed Setup Guide**: See [GOOGLE_SHEET_SETUP.md](GOOGLE_SHEET_SETUP.md) for full instructions and the ready-to-paste `Code.gs` script.


---

## 📊 Flag Overview & Scoring

| Category | Type | Flags | Points Each | Subtotal |
|----------|------|-------|-------------|----------|
| 1. Network & Ports | Cyber Scenario | 4 | 50 pts | 200 pts |
| 2. Protocols & Encryption | Cyber Scenario | 4 | 50 pts | 200 pts |
| 3. Threats & Attacks | Cyber Scenario | 4 | 50 pts | 200 pts |
| 4. Password Security | Cyber Scenario | 4 | 50 pts | 200 pts |
| 5. Web Security Basics | Cyber Scenario | 4 | 50 pts | 200 pts |
| 6. Security Awareness | Cyber Scenario | 4 | 50 pts | 200 pts |
| 7. Hidden Website Flags | Hands-on Inspection | 6 | 100 pts (Bonus) | 600 pts |
| **TOTAL** | | **30 Flags** | | **1,800 pts** |

---

## 🏁 Master Answer Key (All 30 Flags)

---

### 🌐 Category 1: Network & Open Ports

| # | Flag | Question / Concept | Answer / Explanation | Difficulty |
|---|------|-------------------|----------------------|------------|
| 1 | `DECODE{port_80}` | What port does HTTP use? | **80** (Default cleartext web traffic) | ⭐ Easy |
| 2 | `DECODE{port_443}` | The secure web port (HTTPS)? | **443** (Encrypted web traffic) | ⭐ Easy |
| 3 | `DECODE{port_21_ftp}` | The file transfer port (FTP)? | **21** (File Transfer Protocol) | ⭐ Easy |
| 4 | `DECODE{port_22_ssh}` | Remote access port (SSH)? | **22** (Secure Shell) | ⭐⭐ Medium |

---

### 🔒 Category 2: Protocols & Encryption

| # | Flag | Question / Concept | Answer / Explanation | Difficulty |
|---|------|-------------------|----------------------|------------|
| 5 | `DECODE{http_is_not_secure}` | HTTP vs HTTPS insecurity | HTTP transmits unencrypted plaintext | ⭐ Easy |
| 6 | `DECODE{ssh_replaced_telnet}` | Telnet danger & replacement | SSH replaced insecure cleartext Telnet | ⭐ Easy |
| 7 | `DECODE{domain_name_system}` | What does DNS stand for? | **Domain Name System** | ⭐ Easy |
| 8 | `DECODE{sftp_is_secure_ftp}` | Secure alternative to FTP | **SFTP** (SSH File Transfer Protocol) | ⭐⭐ Medium |

---

### ⚠️ Category 3: Threats & Attacks

| # | Flag | Question / Concept | Answer / Explanation | Difficulty |
|---|------|-------------------|----------------------|------------|
| 9 | `DECODE{phishing_attack}` | Fake login emails/sites | **Phishing** | ⭐ Easy |
| 10 | `DECODE{ransomware}` | Malware encrypting files for ransom | **Ransomware** | ⭐ Easy |
| 11 | `DECODE{social_engineering}` | Psychological manipulation of people | **Social Engineering** | ⭐⭐ Medium |
| 12 | `DECODE{ddos_attack}` | Flooding server with junk requests | **DDoS** (Distributed Denial of Service) | ⭐ Easy |

---

### 🔑 Category 4: Password Security

| # | Flag | Question / Concept | Answer / Explanation | Difficulty |
|---|------|-------------------|----------------------|------------|
| 13 | `DECODE{123456}` | The most common weak password | `123456` | ⭐ Easy |
| 14 | `DECODE{brute_force_attack}` | Trying every possible password | **Brute Force Attack** | ⭐ Easy |
| 15 | `DECODE{two_factor_authentication}` | Two-step verification (2FA) | **Two-Factor Authentication** | ⭐⭐ Medium |
| 16 | `DECODE{change_default_passwords}` | Common vulnerability in routers/IoT | Never leave default passwords unchanged | ⭐ Easy |

---

### 🕸️ Category 5: Web Security Basics

| # | Flag | Question / Concept | Answer / Explanation | Difficulty |
|---|------|-------------------|----------------------|------------|
| 17 | `DECODE{html_comments_are_not_hidden}` | Leaked comments in source code | HTML comments `<!-- ... -->` are public | ⭐ Easy |
| 18 | `DECODE{session_hijacking}` | Stealing cookies to hijack accounts | **Session Hijacking** | ⭐⭐ Medium |
| 19 | `DECODE{hidden_divs_are_visible_in_dom}` | Hidden CSS elements in DOM | `display:none` is still visible in DOM | ⭐ Easy |
| 20 | `DECODE{console_logs_reveal_secrets}` | Debug messages in browser console | `console.log()` outputs in browser DevTools | ⭐ Easy |

---

### 🛡️ Category 6: Security Awareness

| # | Flag | Question / Concept | Answer / Explanation | Difficulty |
|---|------|-------------------|----------------------|------------|
| 21 | `DECODE{firewall}` | Traffic monitor & packet filter | **Firewall** | ⭐ Easy |
| 22 | `DECODE{vpn_virtual_private_network}` | Encrypted tunnel hiding IP address | **VPN** (Virtual Private Network) | ⭐ Easy |
| 23 | `DECODE{ssl_tls_certificate}` | Certificate showing padlock icon 🔒 | **SSL / TLS Certificate** | ⭐⭐ Medium |
| 24 | `DECODE{security_patch}` | Software bug fix update | **Security Patch / Update** | ⭐ Easy |

---

### 🕵️ Category 7: Hidden Website Flags (Hands-on Exploration)

These flags are planted in the actual code of `index.html`. Participants must inspect the page to find them!

| # | Flag | Where in the Code | How the Participant Finds It |
|---|------|-------------------|------------------------------|
| 25 | `DECODE{html_comments_are_not_hidden}` | `<head>` top comment (line 9) | Right click → **View Page Source** (or `Ctrl + U`) |
| 26 | `DECODE{check_meta_tags_always}` | `<meta name="secret-key">` (line 10) | View Source → inspect `<meta>` tags near top |
| 27 | `DECODE{css_vars_leak_secrets}` | Inside `:root` CSS comment (line 33) | View Source → inspect the `<style>` block |
| 28 | `DECODE{hidden_divs_are_visible_in_dom}` | Hidden `<div>` attribute `data-flag` (line 330) | Press `F12` → Elements tab → search `data-flag` |
| 29 | `DECODE{elements_hidden_by_css_still_exist}` | Inner `<p>` text of hidden `<div>` (line 331) | Press `F12` → expand the hidden `<div>` |
| 30 | `DECODE{console_logs_reveal_secrets}` | Browser Console output (line 768) | Press `F12` → click **Console** tab (printed in green!) |
| 31 | `DECODE{plaintext_database_storage_is_vulnerable}` | Database Section / Raw DB JSON Dump | Scroll to **#database** → Click **View Raw DB Dump** or inspect `ROOT_ADMINISTRATOR` entry |

---

## 💡 Pro-Tips for the Organizer During the Event

1. **Kickoff Demonstration (2 mins)**:
   - Show them on the projector: "Right-click anywhere and press *View Page Source*."
   - Show them: "Press `F12` and click *Console*."
   - This gets even complete beginners immediately excited and engaged.
2. **If someone gets stuck**:
   - Point them to the **Hints & Resources** section on the website.
   - Remind them that flags always start with `DECODE{` and end with `}`.
3. **Tie-Breaker Rule**:
   - If two participants get the same score, the participant who submitted their answers earlier wins!

---
*Decode Arena — Symposium 2026*
