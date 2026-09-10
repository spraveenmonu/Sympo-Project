/**
 * DECODE ARENA 2026 — Database Viewer Utility
 * Run in terminal: node view_database.js
 * Reads and displays all stored records from database/arena_database.json
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database', 'arena_database.json');

if (!fs.existsSync(DB_FILE)) {
    console.log('No database file found at:', DB_FILE);
    process.exit(1);
}

try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const records = JSON.parse(raw);

    console.log('\n========================================================================================');
    console.log('📦 DECODE ARENA 2026 — PROJECT DATABASE RECORDS (UNENCRYPTED STORAGE)');
    console.log('📁 File: ' + DB_FILE);
    console.log(`📊 Total Submissions: ${records.length}`);
    console.log('========================================================================================\n');

    records.forEach((r, idx) => {
        const membersStr = Array.isArray(r.members) ? r.members.join(', ') : (r.members || r.name);
        const hasImageFile = r.stored_image_file && r.stored_image_file !== 'none';
        const imgInfo = hasImageFile ? `${r.stored_image_file} (${r.stored_image_size_kb || '?'} KB)` : 
                        (r.stored_image_data ? `${Math.round(r.stored_image_data.length / 1024)} KB (Base64)` : 'None');

        console.log(`[#${idx + 1}] ID: ${r.id} | Mode: ${(r.mode||'solo').toUpperCase()} | Action: ${r.action || 'Submission'}`);
        console.log(`     Name/Team:   ${r.name}`);
        console.log(`     College:     ${r.college}`);
        console.log(`     Members:     ${membersStr}`);
        console.log(`     Score:       ${r.score} PTS (${r.solved || 'N/A'} solved) | Tier: ${r.tier}`);
        console.log(`     Action:      ${r.action || 'Scorecard Submission'}`);
        console.log(`     Encryption:  ${r.encryption || 'NONE (Plaintext)'}`);
        console.log(`     Cert Image:  ${imgInfo}`);
        console.log(`     Timestamp:   ${r.timestamp}`);
        if (r.secret_flag) {
            console.log(`     🚩 FLAG:     ${r.secret_flag}`);
        }
        console.log('----------------------------------------------------------------------------------------');
    });

    console.log('\n💡 Note: All records above are stored in plaintext without encryption inside database/arena_database.json\n');
} catch(err) {
    console.error('Error reading database:', err.message);
}
