# 🛠️ Decode Arena — Organizer Customization & Extension Guide
### "Make It Yours" Manual: How to Customize, Add Challenges & Hack Outside Bugs

---

## 🌟 Overview
Decode Arena is built to be **simple, modular, and developer-friendly**. As the organizer or lead developer, you can easily customize challenges, add new outside bugs, adjust scoring, and demonstrate operations with 1 click.

This guide explains:
1. **The 12 Intentional "Outside Bugs"** (Planted outside regular questions for DevTools inspection).
2. **How to Add Your Own Outside Bugs & Easter Eggs**.
3. **How to Customize Round 1 Scenarios & Points**.
4. **How to Run & Customize Round 2 Operations (with 1-Click Demos)**.
5. **How Live Google Sheets & Offline Queues Work**.

---

## 🕵️ Part 1: The 12 Intentional "Outside Bugs"
These vulnerabilities are planted directly into the website's frontend code, storage, and runtime environment. Participants must use `Ctrl+U` (View Source), `F12` (DevTools Elements, Console, Application), and URL query parameters to find them:

| # | Vulnerability Class | Flag | Where It's Planted | How to Find It | Points |
|---|---------------------|------|--------------------|----------------|--------|
| **1** | **CWE-615: HTML Comment Leak** | `DECODE{html_comments_are_not_hidden}` | `<head>` line 13 | Press `Ctrl+U` → View Source → Look near top | **+50** |
| **2** | **CWE-200: Meta Tag Secret** | `DECODE{check_meta_tags_always}` | `<meta name="secret-key">` | Press `Ctrl+U` → Look at `<meta>` tags | **+100** |
| **3** | **CWE-540: CSS Variable Leak** | `DECODE{css_vars_leak_secrets}` | `<style>` `:root` comment | Press `Ctrl+U` → Inspect `:root` styles | **+100** |
| **4** | **CWE-200: DOM Data-Flag Leak** | `DECODE{hidden_divs_are_visible_in_dom}` | `<div class="hidden-challenge-dom">` | `F12` Elements → Search `data-flag` | **+50** |
| **5** | **CWE-601: Display:None Element** | `DECODE{elements_hidden_by_css_still_exist}` | Inner `<p>` tag in hidden div | `F12` Elements → Expand hidden div | **+100** |
| **6** | **CWE-532: Browser Console Log** | `DECODE{console_logs_reveal_secrets}` | DevTools Console on page load | `F12` → Click **Console** tab | **+50** |
| **7** | **CWE-312: Unencrypted Database** | `DECODE{plaintext_database_storage_is_vulnerable}` | `database/arena_database.json` | Scroll to `#database` → Click **View Raw DB Dump** | **+100** |
| **8** | **CWE-548: Robots / Admin Leak** | `DECODE{robots_txt_reveals_paths}` | Public HTML comment near footer | `Ctrl+U` → Search `Disallow: /admin` | **+100** |
| **9** | **CWE-489: URL Debug Parameter** | `DECODE{debug_mode_url_parameter_vulnerability}` | Query parameter `?debug=true` or `?admin=1` | Visit `http://localhost:3000/?debug=true` | **+100** |
| **10** | **CWE-922: LocalStorage Token** | `DECODE{client_storage_token_leak}` | `localStorage['auth_debug_token']` | `F12` → Application → Local Storage | **+100** |
| **11** | **CWE-614: Insecure Cookie Leak** | `DECODE{unprotected_cookie_flag}` | `document.cookie` (`sympo_session`) | `F12` → Application → Cookies (or type `document.cookie`) | **+100** |
| **12** | **CWE-497: Global Window Object** | `DECODE{global_window_scope_leak}` | `window.__CYBER_DEV_BACKDOOR__` | `F12` → Console → Type `__CYBER_DEV_BACKDOOR__` | **+100** |

---

## 🚀 Part 2: How to Add Your Own Outside Bug
To add a new outside bug:
1. Open `index.html`.
2. Locate `const BONUS_FLAGS = { ... }`.
3. Add your new flag entry:
```javascript
"decode{my_custom_secret}": { 
    points: 100, 
    label: "Custom API Key Leak", 
    flag: "DECODE{my_custom_secret}", 
    category: "API Secret CWE-540" 
}
```
4. Plant the secret anywhere in `index.html` (e.g. inside an image `alt` attribute, an HTTP header simulation, or a hidden `<button>`).
5. When participants paste `DECODE{my_custom_secret}` into the **"Found a Secret Hidden Flag?"** box, the app will instantly award points and celebrate with confetti!

---

## 📝 Part 3: How to Customize Round 1 Scenarios
All 24 scenarios are defined in `const CHALLENGES = { ... }` in `index.html`.

Each scenario has this clean structure:
```javascript
"c1_1": {
    cat: 1, 
    title: "Scenario 1: Default Cleartext Web Traffic", 
    diff: "Easy", 
    points: 50,
    desc: "What port does HTTP use?",
    hint: "Standard two-digit port for unencrypted web.",
    options: ["21", "80", "443", "8080"],
    correct: 1, // 0 = A, 1 = B, 2 = C, 3 = D
    flag: "DECODE{port_80}",
    answers: ["80", "port 80", "port80", "decode{port_80}"],
    explanation: "Port 80 is the standard port for unencrypted HTTP traffic."
}
```

### To edit or add a scenario:
- Modify `title`, `desc`, `options`, or `points`.
- `correct` is 0-indexed (`0` = Option A, `1` = Option B, `2` = Option C, `3` = Option D).
- `answers` lists accepted typed inputs (case-insensitive).
- `flag` is the official flag rewarded upon completion.

---

## ⚔️ Part 4: How Round 2 (Apex Cyber Warfare) Works
Round 2 consists of 9 interactive cybersecurity labs.

### Clearance Unlock Key:
- The arena is locked behind a password gate.
- Default clearance keywords: `CYBERWAR2026`, `FINALS2026`, `APEX2026`.
- You can add or modify clearance keys in `const ROUND2_KEYWORDS = ['CYBERWAR2026', ...];` in `index.html`.

### Mission Instructions & Guided Clues:
- Every Round 2 operation card features:
  - **🎯 Manual Mission Guide**: Clear step-by-step instructions on what tools to use and what actions to execute.
  - **💡 Tactical Clues & Step-by-Step Guide**: Expandable accordion detailing the underlying concepts and hints without spoiling answers directly.
  - **`[SUBMIT]`**: Once the participant conducts the required lab action, clicking `SUBMIT` validates their work, awards points, and updates the symposium scoreboard.

---

## 📊 Part 5: Google Sheets Live Sync
- **Webhook Endpoint**: Configured in `CONFIG.API_URL`.
- **Sync Behavior**:
  - Submitting the official scorecard automatically streams data into the `ROUND_DATA` tab in Google Sheets.
  - Columns logged: `Timestamp`, `Team_ID`, `Team_Name`, `College`, `Members`, `Mode`, `Round`, `Score`, `Total`, `Correct`, `Wrong`, `Security_Tier`, `Start_Time`, `End_Time`, `Time_Taken`, and `Action`.
- **Offline Resilience**:
  - If Wi-Fi disconnects, scores are queued locally in `localStorage`.
  - When connection is restored, pending scores flush automatically to the Google Sheet.

---

## 🏆 Scoring Summary
- **Stage 1 (Reconnaissance Scenarios)**: 24 Scenarios = **1,800 PTS**
- **Stage 2 (Apex Cyber Warfare)**: 9 Operations = **2,600 PTS**
- **Outside Bugs (12 Planted Secrets)**: 12 Secrets = **1,100 Bonus PTS**
- **Grand Total Possible**: **5,500 PTS**

---
*Created for Decode Arena — Symposium 2026*
