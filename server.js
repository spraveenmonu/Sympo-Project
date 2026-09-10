/**
 * DECODE ARENA 2026 — Local Project Database Server
 * Zero dependencies — Uses pure Node.js built-in modules ('http', 'fs', 'path')
 * Stores submitted scores, participant info, and certificate images directly to:
 *   d:\Projects\Sympo Project\database\arena_database.json (Unencrypted)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

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
    try { fs.copyFileSync(DB_FILE, DB_ALT_FILE); } catch(e){}
}
if (!fs.existsSync(DB_ROOT_FILE)) {
    try { fs.copyFileSync(DB_FILE, DB_ROOT_FILE); } catch(e){}
}

function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
    res.setHeader('Access-Control-Max-Age', '86400');
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
                } catch(e) {
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
                    } catch(imgErr) {
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
                try { fs.writeFileSync(DB_ALT_FILE, dbJsonFormatted, 'utf8'); } catch(e) {}
                try { fs.writeFileSync(DB_ROOT_FILE, dbJsonFormatted, 'utf8'); } catch(e) {}

                console.log(`[DATABASE UPDATE] Stored unencrypted record: ${record.name} (${record.score} PTS) [Action: ${record.action}] -> arena_database.json & database.json`);
                if (record.stored_image_file !== 'none') {
                    console.log(`[CERTIFICATE SAVED] Saved physical image file -> ${record.stored_image_file} (${record.stored_image_size_kb} KB)`);
                }

                // Also append SQL entry to schema.sql
                try {
                    const membersStr = Array.isArray(record.members) ? record.members.join(', ') : record.name;
                    const sqlInsert = `\nINSERT INTO submissions (id, mode, name, college, members, score, solved, tier, action, encryption, image_file, timestamp) VALUES ('${record.id}', '${record.mode}', '${(record.name||'').replace(/'/g,"''")}', '${(record.college||'').replace(/'/g,"''")}', '${membersStr.replace(/'/g,"''")}', ${record.score||0}, '${record.solved||'0/24'}', '${record.tier||'CYBER SCOUT'}', '${(record.action||'Submission').replace(/'/g,"''")}', 'NONE (Plaintext)', '${record.stored_image_file || 'none'}', CURRENT_TIMESTAMP);`;
                    fs.appendFileSync(SQL_FILE, sqlInsert, 'utf8');
                } catch(sqlErr) {}

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Successfully stored in project database (database/arena_database.json & database.json) without encryption!',
                    record_id: record.id,
                    action: record.action,
                    image_file: record.stored_image_file,
                    total_records: records.length,
                    file_path: 'database/arena_database.json & database.json'
                }));
            } catch(err) {
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
        } catch(e) {
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
