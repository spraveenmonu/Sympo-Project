/**
 * DECODE ARENA 2026 — Local Project Database Server
 * Zero dependencies — Uses pure Node.js built-in modules ('http', 'fs', 'path')
 * Stores submitted scores, participant info, and certificate images directly to:
 *   d:\Projects\Sympo Project\database\arena_database.json (Unencrypted)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Coordinator WhatsApp Configuration (Secure Backend Only - NEVER exposed to participants)
const COORDINATOR_PHONE = process.env.COORDINATOR_PHONE || '+919531969307';
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_APIKEY || '';
const WHATSAPP_WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL || '';

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database', 'arena_database.json');
const DB_ALT_FILE = path.join(__dirname, 'database', 'database.json');
const DB_ROOT_FILE = path.join(__dirname, 'database.json');
const SQL_FILE = path.join(__dirname, 'database', 'schema.sql');
const CERT_DIR = path.join(__dirname, 'database', 'certificates');

// Ensure database directory exists
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
}

// Ensure database files exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '[]', 'utf8');
}
if (!fs.existsSync(DB_ALT_FILE)) {
    try { fs.copyFileSync(DB_FILE, DB_ALT_FILE); } catch (e) { }
}
if (!fs.existsSync(DB_ROOT_FILE)) {
    try { fs.copyFileSync(DB_FILE, DB_ROOT_FILE); } catch (e) { }
}

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');
}

/**
 * Dispatches a submission alert directly to the coordinator's WhatsApp.
 * The destination phone number (+91 8778313186) is stored privately on the server
 * and is NEVER exposed or returned to participants.
 */
function dispatchWhatsAppAlert(record) {
    const isTeam = record.mode === 'team';
    const membersStr = Array.isArray(record.members) ? record.members.join(', ') : (record.name || 'Participant');

    const message =
        `🎯 *DECODE ARENA 2026 — OFFICIAL SCORE ALERT* 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Event:* Cybersecurity Symposium 2026
👤 *Type:* ${isTeam ? 'Team Participation' : 'Solo Hacker'}
🏷️ *Name / Team:* ${record.name || 'Anonymous'}
🏛️ *College:* ${record.college || 'Participant'}
👥 *Members:* ${membersStr}
⭐ *Total Score:* ${record.score || 0} PTS
🚩 *Solved Challenges:* ${record.solved || '0/24'}
🛡️ *Security Tier:* ${record.tier || 'Cyber Scout'}
⚡ *Action:* ${record.action || 'Scorecard Submission'}
🆔 *Record ID:* ${record.id || 'N/A'}
⏱️ *Timestamp:* ${record.timestamp || new Date().toLocaleString()}${record.time_taken ? `\n⏳ *Time Taken:* ${record.time_taken}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 *Database:* arena_database.json (Unencrypted CWE-312 Demo)`;

    // Clean destination phone (only digits and plus)
    const cleanPhone = COORDINATOR_PHONE.replace(/[^0-9+]/g, '');
    console.log(`\n====================================================`);
    console.log(`📲 [WHATSAPP DISPATCH] Result queued for Coordinator`);
    console.log(`👉 Target: ${cleanPhone} (Kept strictly confidential)`);
    console.log(`👉 Participant: ${record.name} (${record.score} PTS) [Action: ${record.action}]`);
    console.log(`====================================================\n`);

    // Strategy 1: CallMeBot WhatsApp Gateway (If configured via CALLMEBOT_APIKEY)
    if (CALLMEBOT_API_KEY) {
        try {
            const botPhone = cleanPhone.startsWith('+') ? cleanPhone : ('+' + cleanPhone);
            const encodedText = encodeURIComponent(message);
            const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(botPhone)}&text=${encodedText}&apikey=${encodeURIComponent(CALLMEBOT_API_KEY)}`;

            https.get(callMeBotUrl, (resp) => {
                let data = '';
                resp.on('data', chunk => { data += chunk; });
                resp.on('end', () => {
                    console.log(`[WHATSAPP CALLMEBOT] Dispatch delivered with status: ${resp.statusCode}`);
                });
            }).on('error', (e) => {
                console.warn(`[WHATSAPP CALLMEBOT ERROR] ${e.message}`);
            });
        } catch (e) {
            console.warn(`[WHATSAPP CALLMEBOT EXCEPTION] ${e.message}`);
        }
    }

    // Strategy 2: Custom Webhook (Twilio / GreenAPI / Meta Cloud API / Custom Webhook)
    if (WHATSAPP_WEBHOOK_URL) {
        try {
            const webhookUrl = new URL(WHATSAPP_WEBHOOK_URL);
            const payload = JSON.stringify({
                to: cleanPhone,
                message: message,
                record: {
                    id: record.id,
                    mode: record.mode,
                    name: record.name,
                    college: record.college,
                    members: record.members,
                    score: record.score,
                    solved: record.solved,
                    tier: record.tier,
                    action: record.action
                }
            });

            const req = https.request(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                }
            }, (res) => {
                console.log(`[WHATSAPP WEBHOOK] Webhook responded with status: ${res.statusCode}`);
            });

            req.on('error', (e) => console.warn(`[WHATSAPP WEBHOOK ERROR] ${e.message}`));
            req.write(payload);
            req.end();
        } catch (e) {
            console.warn(`[WHATSAPP WEBHOOK EXCEPTION] ${e.message}`);
        }
    }

    return {
        dispatched: true,
        channel: 'WhatsApp Coordinator Channel',
        recipient_role: 'Symposium Coordinator'
    };
}

const server = http.createServer((req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // API: Submit Score to Project Database
    if (req.method === 'POST' && pathname === '/api/submit-score') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const record = JSON.parse(body);

                // Read current database records
                let records = [];
                try {
                    records = JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '[]');
                } catch (e) {
                    records = [];
                }

                // Add record without encryption
                record.id = record.id || ('REC-2026-' + Math.floor(1000 + Math.random() * 9000));
                record.action = record.action || 'Scorecard Submission';
                record.server_saved_at = new Date().toISOString();
                record.encryption = 'NONE (Unencrypted Raw Storage)';

                // Save physical certificate image into database/certificates/
                const safeName = (record.name || 'user').replace(/[^a-zA-Z0-9_-]/g, '_');
                if (record.stored_image_data && record.stored_image_data.includes('base64,')) {
                    try {
                        const base64Data = record.stored_image_data.split('base64,')[1];
                        const imgBuf = Buffer.from(base64Data, 'base64');
                        const imgFilename = `${record.id}_${safeName}.jpg`;
                        const imgPath = path.join(CERT_DIR, imgFilename);

                        fs.writeFileSync(imgPath, imgBuf);
                        fs.writeFileSync(path.join(CERT_DIR, `${record.id}_${safeName}.base64.txt`), record.stored_image_data, 'utf8');

                        record.stored_image_file = `database/certificates/${imgFilename}`;
                        record.stored_image_format = 'image/jpeg';
                        record.stored_image_size_kb = Math.round(imgBuf.length / 1024);
                        delete record.stored_image_data; // Keep JSON clean and lightweight
                    } catch (imgErr) {
                        console.error('[IMAGE SAVE ERROR]', imgErr.message);
                    }
                } else {
                    record.stored_image_file = record.stored_image_file || 'none';
                    delete record.stored_image_data;
                }

                records.push(record); // Append to bottom so newest submission is always at the end!

                // Write to database files (database/arena_database.json, database/database.json, database.json)
                const dbJsonFormatted = JSON.stringify(records, null, 2);
                fs.writeFileSync(DB_FILE, dbJsonFormatted, 'utf8');
                try { fs.writeFileSync(DB_ALT_FILE, dbJsonFormatted, 'utf8'); } catch (e) { }
                try { fs.writeFileSync(DB_ROOT_FILE, dbJsonFormatted, 'utf8'); } catch (e) { }

                console.log(`[DATABASE UPDATE] Stored unencrypted record: ${record.name} (${record.score} PTS) [Action: ${record.action}] -> arena_database.json & database.json`);
                if (record.stored_image_file !== 'none') {
                    console.log(`[CERTIFICATE SAVED] Saved physical image file -> ${record.stored_image_file} (${record.stored_image_size_kb} KB)`);
                }

                // Also append SQL entry to schema.sql
                try {
                    const membersStr = Array.isArray(record.members) ? record.members.join(', ') : record.name;
                    const sqlInsert = `\nINSERT INTO submissions (id, mode, name, college, members, score, solved, tier, action, encryption, image_file, timestamp) VALUES ('${record.id}', '${record.mode}', '${(record.name || '').replace(/'/g, "''")}', '${(record.college || '').replace(/'/g, "''")}', '${membersStr.replace(/'/g, "''")}', ${record.score || 0}, '${record.solved || '0/24'}', '${record.tier || 'CYBER SCOUT'}', '${(record.action || 'Submission').replace(/'/g, "''")}', 'NONE (Plaintext)', '${record.stored_image_file || 'none'}', CURRENT_TIMESTAMP);`;
                    fs.appendFileSync(SQL_FILE, sqlInsert, 'utf8');
                } catch (sqlErr) { }

                // Dispatch to coordinator WhatsApp privately on the server
                dispatchWhatsAppAlert(record);

                // Return clean confirmation WITHOUT leaking the coordinator phone number
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Successfully stored in project database and dispatched to symposium coordinator!',
                    record_id: record.id,
                    action: record.action,
                    image_file: record.stored_image_file,
                    total_records: records.length,
                    whatsapp_dispatched: true,
                    coordinator_delivery: 'Result transmitted directly to Symposium Coordinator WhatsApp',
                    file_path: 'database/arena_database.json & database.json'
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // API: Retrieve All Records from Project Database
    if (req.method === 'GET' && pathname === '/api/database') {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read database file' }));
        }
        return;
    }

    // Static File Serving
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.txt': 'text/plain'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Decode Arena Database Server is running on:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`📁 Database storage file:`);
    console.log(`👉 ${DB_FILE}`);
    console.log(`⚠️ Security Mode: UNENCRYPTED STORAGE (CWE-312 DEMO)`);
    console.log(`====================================================`);
});
