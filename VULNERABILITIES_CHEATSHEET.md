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

### 🕵️ Category 7: Outside Bugs & Hidden Website Vulnerabilities (Hands-on Exploration)

These intentional vulnerabilities are planted directly **outside** the scenario questions into the website code, browser environment, client storage, and server assets. Participants hunt for them using browser tools (`Ctrl+U` View Source, `F12` DevTools, Console, Storage, Cookies, URL parameters):

| # | Flag | Vulnerability Classification | Where in the Code / System | How to Find It | Points |
|---|------|-----------------------------|----------------------------|----------------|--------|
| 25 | `DECODE{html_comments_are_not_hidden}` | **CWE-615** (Source Comment Leak) | `<head>` top comments (line 13) | Right-click → **View Page Source** (`Ctrl+U`) | **+50** |
| 26 | `DECODE{check_meta_tags_always}` | **CWE-200** (Information Exposure) | `<meta name=\"secret-key\">` (line 14) | View Source → inspect `<meta>` tags in `<head>` | **+100** |
| 27 | `DECODE{css_vars_leak_secrets}` | **CWE-540** (Stylesheet Information Leak) | Inside `:root` CSS comment (line 37) | View Source → inspect `<style>` block in `<head>` | **+100** |
| 28 | `DECODE{hidden_divs_are_visible_in_dom}` | **CWE-200** (DOM Attribute Exposure) | Hidden `<div>` attribute `data-flag` (line 1622) | Press `F12` → Elements tab → search `data-flag` | **+50** |
| 29 | `DECODE{elements_hidden_by_css_still_exist}` | **CWE-601** (Client-Side Display:None) | Inner `<p>` text of hidden `<div>` (line 1623) | Press `F12` → expand the hidden `<div>` element | **+100** |
| 30 | `DECODE{console_logs_reveal_secrets}` | **CWE-532** (Sensitive Info in Log Files) | DevTools Console Startup Output | Press `F12` → click **Console** tab (printed in green!) | **+50** |
| 31 | `DECODE{plaintext_database_storage_is_vulnerable}` | **CWE-312** (Cleartext Storage of Sensitive Data) | `database/arena_database.json` & DB section | Scroll to **#database** → Click **View Raw DB Dump** | **+100** |
| 32 | `DECODE{robots_txt_reveals_paths}` | **CWE-548** (Robots / Admin Path Disclosure) | Public comment near footer | View Source → Search `Disallow: /admin` | **+100** |
| 33 | `DECODE{debug_mode_url_parameter_vulnerability}` | **CWE-489** (Active Debug Code in Production) | URL Query Parameter (`?debug=true` or `?admin=1`) | Append `?debug=true` to URL or visit with `?admin=1` | **+100** |
| 34 | `DECODE{client_storage_token_leak}` | **CWE-922** (Insecure Client-Side Storage) | `localStorage.getItem('auth_debug_token')` | `F12` → Application tab → Storage → Local Storage | **+100** |
| 35 | `DECODE{unprotected_cookie_flag}` | **CWE-614** (Insecure Sensitive Cookie) | `document.cookie` (`sympo_session`) | `F12` → Application tab → Cookies (or type `document.cookie`) | **+100** |
| 36 | `DECODE{global_window_scope_leak}` | **CWE-497** (System Variable Exposure) | `window.__CYBER_DEV_BACKDOOR__` | `F12` → Console → type `__CYBER_DEV_BACKDOOR__` | **+100** |

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

---

## ⚔️ ROUND 2: APEX CYBER WARFARE (ORGANIZER MASTER KEY)
### 🔒 Clearance Unlock Keyword: `CYBERWAR2026` (or `FINALS2026`, `APEX2026`)

Round 2 is a locked, high-complexity manual cyber warfare arena designed for qualifying participants. Participants must enter the clearance keyword to decrypt and access the 9 interactive lab environments.

### 🏆 Score Distribution
- **Stage 1 (Reconnaissance Assessment)**: 24 Scenario Decisions = **1,800 PTS**
- **Stage 2 (Apex Cyber Warfare)**: 9 Interactive Labs = **2,600 PTS**
- **Grand Championship Total**: **4,400 PTS**

---

### 🛡️ Stage 2 Operations Master Table

| Op # | Attack / Defense Vector | Lab Concept | Tactical Clue & Manual Solution | Points | Official Flag |
|------|-------------------------|-------------|---------------------------------|--------|---------------|
| **01** | **SQL Injection (SQLi)** | WAF Bypass & Vault Extraction | Inject UNION query: `1' UNION SELECT 1, token, secret FROM internal_vault--` to dump hidden token column. | **+300** | `DECODE{sqli_union_vault_breached_2026}` |
| **02** | **Password Cracking** | Linux Shadow Hash Rainbow Table | Load wordlist `rockyou_sympo.txt`. Dictionary attack cracks `$6$qZ7x8...` to reveal plaintext `quantum_shadow_8832`. | **+250** | `DECODE{hash_rainbow_table_cracked_8832}` |
| **03** | **Brute Force & Rate-Limit Bypass** | 4-Digit Security PIN & HTTP 429 Evasion | Enable `Spoof Header: X-Forwarded-For: 127.0.0.1` to reset firewall lockout. Submit PIN `7491` to unlock gateway. | **+250** | `DECODE{rate_limit_bypassed_pin_cracked}` |
| **04** | **Honeypot Reconnaissance** | Deception Fingerprinting | Probe ports 2222 (Cowrie), 502 (Conpot), 8080 (Glastopf). Identify real port **9443** (OpenSSL 1.1.1u) to get genuine flag. | **+250** | `DECODE{honeypot_fingerprinted_real_target_found}` |
| **05** | **Binary Reverse Engineering** | x86 Instruction Math Inversion | Target `0x2DEB`. Invert math: `0x2DEB - 0x05A0 = 0x284B`; `0x284B XOR 0x1337 = 0x3B7C` = `15228` decimal. Run debugger with `15228`. | **+350** | `DECODE{reverse_eng_register_math_solved}` |
| **06** | **Spear-Phishing Forensics** | RFC-5322 Headers & Macro Deobfuscation | Inspect forged headers (`Return-Path: malicious-relay.su`, `DKIM: FAIL`). Extract VBA macro and decode Base64 PowerShell cradle. | **+250** | `DECODE{phishing_macro_payload_deobfuscated}` |
| **07** | **Ransomware Memory Forensics** | SCADA Process Heap Dump (PID 4192) | Dump PID 4192 RAM. Locate `AES_KEY=K3y_4398_AES_M3M_DUMP!` and `AES_IV=IV_9091_VECTOR`. Inject keys to defuse reactor. | **+400** | `DECODE{r4ns0mw4r3_m3m0ry_f0r3ns1cs_d3crypt3d}` |
| **08** | **Malware & Rootkit Disassembly** | Registry Run Key & Driver Unhook | Scan HKLM Run keys. Spot rogue `WinAudioUpdate` entry. Unhook `svchost_rootkit.sys` kernel driver and purge registry key. | **+250** | `DECODE{malware_persistence_rootkit_neutralized}` |
| **09** | **Volumetric DDoS Mitigation** | NetFlow Telemetry & BGP Drop Filter | Sample NetFlow: 98.4% SYN flood from `198.51.100.0/24`. Build TCAM filter: Action `DROP`, Proto `TCP SYN`, CIDR `198.51.100.0/24`. | **+300** | `DECODE{ddos_syn_flood_scrubbed_offline_prevented}` |

---

### 📜 Certificate & Scorecard Stage Breakdown
Participants can switch the certificate between 3 views using the stage tabs:
1. **Stage 1: Recon (1,800 PTS)**: Generates verified certificate for Round 1 scenarios.
2. **Stage 2: Warfare (2,600 PTS)**: Generates verified certificate for Round 2 cyber operations.
3. **👑 Grand Championship (4,400 PTS)**: Combines Stage 1 + Stage 2 for the ultimate symposium champion award.

Exports available on the Scorecard:
- 📥 **Download Certificate (PNG)**
- 📥 **Download Certificate (JPG)**
- 📋 **Copy Text Summary** (includes Stage 1, Stage 2, and Grand Total)
- 📲 **Send to WhatsApp Coordinator**
- 🖨️ **Print Certificate**
- 🚀 **Submit to Google Sheet** (`ROUND_DATA` tab via Google Apps Script)
