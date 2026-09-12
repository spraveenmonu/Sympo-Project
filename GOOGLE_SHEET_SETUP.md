# 📊 Google Sheets Apps Script Setup Guide — Decode Arena 2026

This guide walks you through setting up a free Google Sheet to automatically receive and log participant scorecard submissions from **Decode Arena 2026** in real time.

---

## 🚀 Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name the spreadsheet: **`Decode Arena 2026 Submissions`**.
3. Rename the bottom sheet tab to: **`ROUND_DATA`** (all caps).
   *(If left as `Sheet1`, the script will automatically fallback to the first sheet, but naming it `ROUND_DATA` is recommended).*

---

## 💻 Step 2: Add the Google Apps Script (`Code.gs`)

1. In your Google Sheet menu, click **Extensions > Apps Script**.
2. Delete any default code in the editor (`function myFunction() { ... }`).
3. Copy and paste the entire script below into the editor:

```javascript
/**
 * DECODE ARENA 2026 — Google Apps Script Web App
 * Receives participant scorecards via POST and logs rows to ROUND_DATA sheet.
 */

// GET handler: Handles direct browser navigation and health checks
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("ROUND_DATA") || ss.getSheets()[0];
    var totalRows = Math.max(0, sheet.getLastRow() - 1);

    return ContentService.createTextOutput(JSON.stringify({
      status: "active",
      message: "Decode Arena 2026 Scoreboard Webhook is ONLINE and ready!",
      sheet_name: sheet.getName(),
      total_submissions_received: totalRows
    }, null, 2)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "active",
      message: "Decode Arena 2026 Webhook is online."
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No post data received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("ROUND_DATA") || ss.getSheets()[0];

    // Automatically create header row if sheet is fresh/empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Team_ID",
        "Team_Name",
        "College",
        "Members",
        "Mode",
        "Round",
        "Score",
        "Total",
        "Correct",
        "Wrong",
        "Security_Tier",
        "Start_Time",
        "End_Time",
        "Time_Taken",
        "Action"
      ]);
      
      // Style headers
      var headerRange = sheet.getRange(1, 1, 1, 16);
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#00f0ff");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Extract payload fields with robust fallbacks
    var timestamp = data.Timestamp || new Date().toISOString();
    var teamId = data.Team_ID || data.id || ("REC-" + Math.floor(1000 + Math.random() * 9000));
    var teamName = data.Team_Name || data.name || "Anonymous";
    var college = data.College || data.college || "Symposium Participant";
    var members = data.Members || (Array.isArray(data.members) ? data.members.join(", ") : teamName);
    var mode = data.Mode || data.mode || "solo";
    var round = data.Round || "Round 1 - Decode Arena";
    var score = Number(data.Score !== undefined ? data.Score : (data.score || 0));
    var total = Number(data.Total_Questions !== undefined ? data.Total_Questions : 24);
    var correct = Number(data.Correct !== undefined ? data.Correct : (data.solved ? parseInt(data.solved) : 0));
    var wrong = Number(data.Wrong !== undefined ? data.Wrong : Math.max(0, total - correct));
    var tier = data.Security_Tier || data.tier || "CYBER SCOUT";
    var startTime = data.Start_Time || "N/A";
    var endTime = data.End_Time || new Date().toISOString();
    var timeTaken = data.Time_Taken || "N/A";
    var action = data.Action || data.action || "Scorecard Submission";

    // Append submission row
    sheet.appendRow([
      timestamp,
      teamId,
      teamName,
      college,
      members,
      mode.toUpperCase(),
      round,
      score,
      total,
      correct,
      wrong,
      tier,
      startTime,
      endTime,
      timeTaken,
      action
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      row: sheet.getLastRow(),
      team_id: teamId,
      score: score
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

> **Tip**: You can also open the newly created [Code.gs](Code.gs) file directly in your project folder, press `Ctrl+A` (Select All) then `Ctrl+C` (Copy), and paste it into Google Apps Script.

4. Click the **💾 Save project** icon (or `Ctrl+S`).
5. Name the project: **`Decode Arena Submissions Webhook`**.

---

## 🌐 Step 3: Deploy as a Web App

1. In the top right corner of Apps Script, click **Deploy > New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and select **Web app**.
3. Configure the deployment settings:
   - **Description**: `Decode Arena Live Score Receiver`
   - **Execute as**: `Me (<your-email>@gmail.com)`
   - **Who has access**: **`Anyone`** ⚠️ *(Crucial! This allows submissions without requiring participants to sign into Google).*
4. Click **Deploy**.
5. Grant permissions if prompted:
   - Click *Authorize access*.
   - Select your Google Account.
   - Click *Advanced* > *Go to Decode Arena Submissions Webhook (unsafe)* > *Allow*.
6. Copy the **Web App URL**. It looks like:
   `https://script.google.com/macros/s/AKfycbz_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec`

---

## 🔗 Step 4: Add the URL to `index.html`

Open `index.html` and paste your URL into the `CONFIG.API_URL` variable near line 1460:

```javascript
const HARDCODED_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwMZiYEiJ3k5lEmqVCLseeCaYNHXfsdDmlnkHxqeH0negOwH6iuNhBEUl73JlchLE7LHA/exec';
const CONFIG = {
    API_URL: HARDCODED_APPS_SCRIPT_URL,
    SHEET_NAME: 'ROUND_DATA',
    ROUND_NAME: 'Round 1 - Decode Arena',
    QUEUE_KEY: 'da_offline_submission_queue',
    SESSION_START_KEY: 'da_session_start_time'
};
```

---

## 📶 Step 5: How Offline Queueing Works

- If a participant submits when internet connectivity drops:
  1. The app catches the failure and calls `saveOffline(data)`.
  2. The record is securely queued in browser `localStorage`.
  3. A notification shows: `📡 Saved to offline queue (will sync when online)`.
  4. As soon as the browser detects an internet connection (`online` event), `syncQueue()` automatically flushes and appends all queued scores into your Google Sheet!
