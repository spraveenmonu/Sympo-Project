/**
 * DECODE ARENA 2026 — Google Apps Script Web App
 * Receives participant scorecards and logs rows to the ROUND_DATA sheet.
 */

// Handles browser visits (GET requests) so clicking the link shows a clean status instead of an error!
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

// Handles scorecard submissions (POST requests from index.html)
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

    // Automatically create styled headers if the sheet is fresh
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
      var headerRange = sheet.getRange(1, 1, 1, 16);
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#00f0ff");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var timestamp = data.Timestamp || new Date().toISOString();
    var teamId = data.Team_ID || data.id || ("REC-" + Math.floor(1000 + Math.random() * 9000));
    var teamName = data.Team_Name || data.name || "Anonymous";
    var college = data.College || data.college || "Symposium Participant";
    var members = data.Members || (Array.isArray(data.members) ? data.members.join(", ") : teamName);
    var mode = (data.Mode || data.mode || "solo").toString().toUpperCase();
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

    sheet.appendRow([
      timestamp,
      teamId,
      teamName,
      college,
      members,
      mode,
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
